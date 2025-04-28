import express, { Request, Response, NextFunction } from 'express';
import { serverConfig } from './config/server';
import cors from "cors";
import cookieParser from "cookie-parser";
import signupRoutes from "./routes/user.routes";
import auth0Routes from "./routes/auth0.routes";
import teamRoutes from "./routes/job.routes";
import productsRoutes from '@/routes/products';
import contactsRoutes from '@/routes/contacts';
import enterprisesRoutes from '@/routes/enterprises';

const PORT = serverConfig.port;

const app = express();

app.use(cors({ origin: `${serverConfig.urlFrontend}`, credentials: true }));

app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));

app.use("/api", signupRoutes, auth0Routes, teamRoutes);
app.use('/api/products', productsRoutes);
app.use('/api/contacts', contactsRoutes);
app.use('/api/enterprises', enterprisesRoutes);

// Middleware de error global (opcional pero recomendado)
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong', error: err.message });
});

app.listen(PORT, () => { console.log(`Server running at PORT ${PORT}`); });