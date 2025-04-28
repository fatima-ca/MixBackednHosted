import { Router } from "express";
import { getJobs, getTeams } from "@/controllers/job.controller";

const router = Router();
router.get("/jobs", getJobs);
router.get("/teams", getTeams);

export default router;