import express, { Request, Response } from "express";
const app = express();
import cookieParser from "cookie-parser";
import cors from "cors";
import globalErrorHandler from "./app/middlewares/globalErrorhandler";
import notFound from "./app/middlewares/notFound";
import router from "./app/routes";

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: ["https://expo-indol.vercel.app"], credentials: true }));

app.use("/api/v1", router);

app.get("/", (req: Request, res: Response) => {
  res.send("Hello world!");
});

app.use(globalErrorHandler);
app.use(notFound);

export default app;
