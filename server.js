import express from 'express';
import mysql from 'mysql2/promise';
import cors from 'cors';
import dotenv from 'dotenv';

// Load environment variables
dotenv?.config();

const app = express();
const PORT = process.env?.PORT || 3001;

// Middleware
app?.use(cors());
app?.use(express?.json());

// MySQL connection configuration
const dbConfig = {
  host: process.env?.DB_HOST || 'localhost',
  user: process.env?.DB_USER || 'root',
  password: process.env?.DB_PASSWORD || '',
  database: process.env?.DB_NAME || 'labor_card_db',
  port: process.env?.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
};

// Create MySQL connection pool
const pool = mysql?.createPool(dbConfig);

// Test database connection
const testConnection = async () => {
  try {
    const connection = await pool?.getConnection();
    console.log('✅ Successfully connected to MySQL database');
    connection?.release();
  } catch (error) {
    console.error('❌ Error connecting to MySQL database:', error?.message);
    process.exit(1);
  }
};

// Initialize database connection
testConnection();

// Helper function to calculate current shift
const getCurrentShift = () => {
  const now = new Date();
  const hours = now?.getHours();
  const minutes = now?.getMinutes();
  const totalMinutes = hours * 60 + minutes;

  if (totalMinutes >= 360 && totalMinutes <= 869) return 1;
  if (totalMinutes >= 870 && totalMinutes <= 1379) return 2;
  return 3;
};

// API Routes

// Worker authentication
app?.get('/api/workers/validate/:personalId', async (req, res) => {
  try {
    const { personalId } = req?.params;
    
    const [rows] = await pool?.execute(
      'SELECT * FROM workers_personal_info WHERE personal_id = ? AND is_active = true',
      [personalId]
    );

    if (rows?.length === 0) {
      return res?.status(404)?.json({ error: 'Працівника не знайдено або деактивовано' });
    }

    res?.json(rows?.[0]);
  } catch (error) {
    console.error('Error validating worker:', error);
    res?.status(500)?.json({ error: 'Помилка сервера при перевірці працівника' });
  }
});

// Production areas
app?.get('/api/production-areas', async (req, res) => {
  try {
    const [rows] = await pool?.execute(
      'SELECT * FROM production_area WHERE is_active = true ORDER BY name'
    );
    res?.json(rows);
  } catch (error) {
    console.error('Error fetching production areas:', error);
    res?.status(500)?.json({ error: 'Помилка завантаження виробничих дільниць' });
  }
});

// Work types by production area
app?.get('/api/work-types/:areaId', async (req, res) => {
  try {
    const { areaId } = req?.params;
    
    const [rows] = await pool?.execute(
      'SELECT * FROM wp_type WHERE production_area_id = ? AND is_active = true ORDER BY name',
      [areaId]
    );
    
    res?.json(rows);
  } catch (error) {
    console.error('Error fetching work types:', error);
    res?.status(500)?.json({ error: 'Помилка завантаження типів робіт' });
  }
});

// Work sub-types by work type
app?.get('/api/work-subtypes/:workTypeId', async (req, res) => {
  try {
    const { workTypeId } = req?.params;
    
    const [rows] = await pool?.execute(
      'SELECT * FROM wp_sub_type WHERE wp_type_id = ? AND is_active = true ORDER BY name',
      [workTypeId]
    );
    
    res?.json(rows);
  } catch (error) {
    console.error('Error fetching work sub-types:', error);
    res?.status(500)?.json({ error: 'Помилка завантаження підтипів робіт' });
  }
});

// Order information
app?.get('/api/orders/:orderNumber', async (req, res) => {
  try {
    const { orderNumber } = req?.params;
    
    const [rows] = await pool?.execute(
      'SELECT * FROM order_info WHERE order_number = ?',
      [orderNumber]
    );

    if (rows?.length === 0) {
      return res?.status(404)?.json({ error: 'Замовлення не знайдено' });
    }

    res?.json(rows?.[0]);
  } catch (error) {
    console.error('Error fetching order info:', error);
    res?.status(500)?.json({ error: 'Помилка завантаження інформації про замовлення' });
  }
});

// Scrap types
app?.get('/api/scrap-types', async (req, res) => {
  try {
    const [rows] = await pool?.execute(
      'SELECT * FROM scrap_type WHERE is_active = true ORDER BY name'
    );
    res?.json(rows);
  } catch (error) {
    console.error('Error fetching scrap types:', error);
    res?.status(500)?.json({ error: 'Помилка завантаження типів браку' });
  }
});

// Work card operations
app?.post('/api/work-cards', async (req, res) => {
  try {
    const {
      worker_id,
      production_area_id,
      wp_type_id,
      wp_sub_type_id,
      order_number,
      item_number,
      shift,
      good_parts = 0,
      scrap_parts = 0,
      material_usage = 0,
      strips_rolls = 0
    } = req?.body;

    const [result] = await pool?.execute(
      `INSERT INTO work_card_data_prod 
       (worker_id, production_area_id, wp_type_id, wp_sub_type_id, order_number, item_number, 
        shift, start_time, good_parts, scrap_parts, material_usage, strips_rolls, status) 
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?, ?, ?, 'active')`,
      [worker_id, production_area_id, wp_type_id, wp_sub_type_id, order_number, item_number, 
       shift, good_parts, scrap_parts, material_usage, strips_rolls]
    );

    const [workCard] = await pool?.execute(
      'SELECT * FROM work_card_data_prod WHERE id = ?',
      [result?.insertId]
    );

    res?.status(201)?.json(workCard?.[0]);
  } catch (error) {
    console.error('Error creating work card:', error);
    res?.status(500)?.json({ error: 'Помилка створення робочої картки' });
  }
});

app?.put('/api/work-cards/:cardId', async (req, res) => {
  try {
    const { cardId } = req?.params;
    const updates = req?.body;
    
    // Build dynamic update query
    const updateFields = [];
    const updateValues = [];
    
    Object.keys(updates)?.forEach(key => {
      if (['good_parts', 'scrap_parts', 'material_usage', 'strips_rolls']?.includes(key)) {
        updateFields?.push(`${key} = ?`);
        updateValues?.push(updates?.[key]);
      }
    });
    
    if (updateFields?.length === 0) {
      return res?.status(400)?.json({ error: 'Немає даних для оновлення' });
    }
    
    updateValues?.push(cardId);
    
    await pool?.execute(
      `UPDATE work_card_data_prod SET ${updateFields?.join(', ')}, updated_at = NOW() WHERE id = ?`,
      updateValues
    );

    const [workCard] = await pool?.execute(
      'SELECT * FROM work_card_data_prod WHERE id = ?',
      [cardId]
    );

    res?.json(workCard?.[0]);
  } catch (error) {
    console.error('Error updating work card:', error);
    res?.status(500)?.json({ error: 'Помилка оновлення робочої картки' });
  }
});

app?.patch('/api/work-cards/:cardId/finish', async (req, res) => {
  try {
    const { cardId } = req?.params;
    const { good_parts, scrap_parts, material_usage, strips_rolls } = req?.body;
    
    await pool?.execute(
      `UPDATE work_card_data_prod 
       SET finish_time = NOW(), good_parts = ?, scrap_parts = ?, material_usage = ?, 
           strips_rolls = ?, status = 'completed', updated_at = NOW() 
       WHERE id = ?`,
      [good_parts, scrap_parts, material_usage, strips_rolls, cardId]
    );

    const [workCard] = await pool?.execute(
      'SELECT * FROM work_card_data_prod WHERE id = ?',
      [cardId]
    );

    res?.json(workCard?.[0]);
  } catch (error) {
    console.error('Error finishing work card:', error);
    res?.status(500)?.json({ error: 'Помилка завершення робочої картки' });
  }
});

// Scrap management
app?.post('/api/scrap-entries', async (req, res) => {
  try {
    const {
      work_card_prod_id,
      scrap_type_id,
      scrap_quantity,
      scrap_reason,
      registered_by,
      notes
    } = req?.body;

    const [result] = await pool?.execute(
      `INSERT INTO work_card_data_quality 
       (work_card_prod_id, scrap_type_id, scrap_quantity, scrap_reason, registered_by, notes, registered_at) 
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [work_card_prod_id, scrap_type_id, scrap_quantity, scrap_reason, registered_by, notes]
    );

    const [scrapEntry] = await pool?.execute(
      'SELECT * FROM work_card_data_quality WHERE id = ?',
      [result?.insertId]
    );

    res?.status(201)?.json(scrapEntry?.[0]);
  } catch (error) {
    console.error('Error creating scrap entry:', error);
    res?.status(500)?.json({ error: 'Помилка реєстрації браку' });
  }
});

app?.get('/api/scrap-entries', async (req, res) => {
  try {
    const { limit = 50, offset = 0, date_from, date_to } = req?.query;
    
    let query = `
      SELECT wcq.*, st.name as scrap_type_name, st.code as scrap_type_code,
             wpi.first_name, wpi.last_name, wpi.personal_id,
             wcp.order_number, wcp.item_number
      FROM work_card_data_quality wcq
      JOIN scrap_type st ON wcq.scrap_type_id = st.id
      JOIN workers_personal_info wpi ON wcq.registered_by = wpi.id  
      JOIN work_card_data_prod wcp ON wcq.work_card_prod_id = wcp.id
      WHERE 1=1
    `;
    
    const queryParams = [];
    
    if (date_from) {
      query += ' AND DATE(wcq.registered_at) >= ?';
      queryParams?.push(date_from);
    }
    
    if (date_to) {
      query += ' AND DATE(wcq.registered_at) <= ?';
      queryParams?.push(date_to);
    }
    
    query += ' ORDER BY wcq.registered_at DESC LIMIT ? OFFSET ?';
    queryParams?.push(parseInt(limit), parseInt(offset));
    
    const [rows] = await pool?.execute(query, queryParams);
    res?.json(rows);
  } catch (error) {
    console.error('Error fetching scrap entries:', error);
    res?.status(500)?.json({ error: 'Помилка завантаження записів браку' });
  }
});

// Statistics
app?.get('/api/statistics/production', async (req, res) => {
  try {
    const { date_from, date_to } = req?.query;
    
    let query = `
      SELECT 
        COUNT(*) as total_cards,
        SUM(good_parts) as total_good_parts,
        SUM(scrap_parts) as total_scrap_parts,
        SUM(material_usage) as total_material_usage,
        AVG(good_parts) as avg_good_parts,
        pa.name as production_area_name
      FROM work_card_data_prod wcp
      JOIN production_area pa ON wcp.production_area_id = pa.id
      WHERE wcp.status = 'completed'
    `;
    
    const queryParams = [];
    
    if (date_from) {
      query += ' AND DATE(wcp.start_time) >= ?';
      queryParams?.push(date_from);
    }
    
    if (date_to) {
      query += ' AND DATE(wcp.start_time) <= ?';
      queryParams?.push(date_to);
    }
    
    query += ' GROUP BY wcp.production_area_id, pa.name ORDER BY total_good_parts DESC';
    
    const [rows] = await pool?.execute(query, queryParams);
    res?.json(rows);
  } catch (error) {
    console.error('Error fetching production stats:', error);
    res?.status(500)?.json({ error: 'Помилка завантаження статистики виробництва' });
  }
});

// Error handling middleware
app?.use((error, req, res, next) => {
  console.error('Server error:', error);
  res?.status(500)?.json({ error: 'Внутрішня помилка сервера' });
});

// Handle 404
app?.use('*', (req, res) => {
  res?.status(404)?.json({ error: 'Маршрут не знайдено' });
});

// Start server
app?.listen(PORT, () => {
  console.log(`🚀 Labor Card Management Server running on port ${PORT}`);
  console.log(`📍 API Base URL: http://localhost:${PORT}/api`);
});