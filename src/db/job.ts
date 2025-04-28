import { Request, Response } from "express";
import { pool } from "@/db/config";

export async function getJobsDB(req: Request, res: Response) {
  try {
    const db = await pool;
    const result = await db.request().query(`
      SELECT ID, Name, IDTeam
      FROM JobPosition
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: "Failed to fetch jobs" });
  }
}

export async function getTeamsDB(req: Request, res: Response) {
  try {
    const db = await pool;
    const result = await db.request().query(`
      SELECT ID, TeamName 
      FROM Team
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error("Error fetching teams:", err);
    res.status(500).json({ error: "Failed to fetch teams" });
  }
}