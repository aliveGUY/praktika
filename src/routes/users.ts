import { Router, Request, Response } from "express";
import { AppDataSource } from "../index";
import { User } from "../entity/User";
import bcrypt from "bcrypt";

const router = Router();

// Register a new user
router.post("/register", async (req: Request, res: Response): Promise<void> => {
  const { name, password, role } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const userRepo = AppDataSource.getRepository(User);
  const user = userRepo.create({ name, password: hashedPassword, role });
  await userRepo.save(user);
  res.redirect("/login");
});

// Login a user and set cookie
router.post("/login", async (req: Request, res: Response): Promise<void> => {
  const { name, password } = req.body;
  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ name });

  if (user && (await bcrypt.compare(password, user.password))) {
    // Set a cookie with the user ID
    res.cookie("userId", user.id, {
      httpOnly: true, // Prevent access via JavaScript
      secure: false,  // Set to true in production with HTTPS
      sameSite: "strict", // Prevent CSRF
    });
    res.redirect("/");
  } else {
    res.status(401).send("Invalid credentials");
  }
});

// Get profile of the logged-in user
router.get("/profile", async (req: Request, res: Response): Promise<void> => {
  const userId = req.cookies.userId; // Read the user ID from cookies

  if (!userId) {
    res.redirect("/login");
    return;
  }

  const userRepo = AppDataSource.getRepository(User);
  const user = await userRepo.findOneBy({ id: parseInt(userId, 10) });

  if (!user) {
    res.status(404).send("User not found");
    return;
  }

  res.send(`
    <h1>${user.name}'s Profile</h1>
    <p>Role: ${user.role}</p>
  `);
});

// Logout a user by clearing the cookie
router.post("/logout", (req: Request, res: Response): void => {
  res.clearCookie("userId");
  res.redirect("/login");
});

export default router;
