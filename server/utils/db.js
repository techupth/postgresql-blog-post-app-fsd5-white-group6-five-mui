import * as pg from "pg";
const { Pool } = pg.default;

const pool = new Pool({
  connectionString: "postgresql://postgres:Server27@localhost:5432/posts",
});

export { pool };
