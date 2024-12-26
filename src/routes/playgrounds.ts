import { Router, Request, Response } from "express";
import { AppDataSource } from "../index";
import { Playground } from "../entity/Playground";

const router = Router();

// Get all playgrounds
router.get("/", async (req: Request, res: Response): Promise<void> => {
  const playgroundRepo = AppDataSource.getRepository(Playground);
  const playgrounds = await playgroundRepo.find();

  const html = playgrounds
    .map(
      (playground) => `
  <li>
    <a href="/playgrounds/${playground.id}" 
       hx-get="/playgrounds/${playground.id}" 
       hx-target="#app" 
       hx-push-url="true">${playground.location}</a>
  </li>
`
    )
    .join("")

  if (html.length === 0) {
    res.send(`
      <p>No Playgrounds Available</p>
      `);
    return
  }

  res.send(html);
});

// Get playground by ID
router.get("/:id", async (req: Request, res: Response): Promise<void> => {
  const playgroundRepo = AppDataSource.getRepository(Playground);
  const playground = await playgroundRepo.findOneBy({ id: parseInt(req.params.id) });

  if (!playground) {
    res.status(404).send("<h1>Playground not found</h1>");
    return
  }

  res.send(`
    <h2>${playground.location}</h2>
    <p>ID: ${playground.id}</p>
    <a href="/" hx-get="/" hx-target="#app" hx-push-url="true">Back to Home</a>
  `);
});

// Create a new playground
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { location } = req.body;

  const playgroundRepo = AppDataSource.getRepository(Playground);
  const existing = await playgroundRepo.findOneBy({ location });

  if (existing) {
    res.status(400).send("Playground location already exists.");
    return
  }

  const playground = playgroundRepo.create({ location });
  await playgroundRepo.save(playground);

  res.redirect("/");
});

export default router;
