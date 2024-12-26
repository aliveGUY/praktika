import { Router, Request, Response } from "express";
import path from "path";

const router = Router();
const viewsPath = path.join(__dirname, "../views");

router.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(viewsPath, "home.html"));
});

router.get("/playgrounds/:id", (req: Request, res: Response) => {
  res.sendFile(path.join(viewsPath, "details.html"));
});

router.get("/bookings/create", (req: Request, res: Response) => {
  res.sendFile(path.join(viewsPath, "create-booking.html"));
});

router.get("/users/login", (req: Request, res: Response) => {
  res.sendFile(path.join(viewsPath, "login.html"));
});

router.get("/users/register", (req: Request, res: Response) => {
  res.sendFile(path.join(viewsPath, "register.html"));
});

router.get("/users/profile", (req: Request, res: Response) => {
  res.sendFile(path.join(viewsPath, "profile.html"));
});

export default router;
