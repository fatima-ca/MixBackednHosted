import { Request, Response } from "express";
import { getJobsDB, getTeamsDB } from "../db/job";

export async function getJobs(req: Request, res: Response){
    getJobsDB(req, res);
}

export async function getTeams(req: Request, res: Response){
    getTeamsDB(req, res);
}