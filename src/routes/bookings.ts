import { Router, Request, Response } from "express";
import { AppDataSource } from "../index";
import { Booking } from "../entity/Booking";
import { Playground } from "../entity/Playground";
import { User } from "../entity/User";

const router = Router();

// Create a new booking
router.post("/", async (req: Request, res: Response): Promise<void> => {
  const { time, description, playgroundId, userId } = req.body;

  const bookingRepo = AppDataSource.getRepository(Booking);
  const playgroundRepo = AppDataSource.getRepository(Playground);

  const playground = await playgroundRepo.findOneBy({ id: parseInt(playgroundId) });

  if (!playground) {
    res.status(404).send("Playground not found.");
    return
  }

  // Ensure no overlapping bookings
  const overlapping = await bookingRepo.findOne({
    where: { time, playground: { id: playground.id } },
  });

  if (overlapping) {
    res.status(400).send("Booking time overlaps with an existing booking.");
    return
  }

  const booking = bookingRepo.create({
    time,
    description,
    playground,
    author: { id: parseInt(userId) } as User,
  });

  await bookingRepo.save(booking);

  res.redirect(`/playgrounds/${playgroundId}`);
});

// Edit a booking
router.post("/:id/edit", async (req: Request, res: Response): Promise<void> => {
  const { description } = req.body;

  const bookingRepo = AppDataSource.getRepository(Booking);
  const booking = await bookingRepo.findOneBy({ id: parseInt(req.params.id) });

  if (!booking) {
    res.status(404).send("Booking not found.");
    return
  }

  booking.description = description;
  await bookingRepo.save(booking);

  res.redirect(`/playgrounds/${booking.playground.id}`);
});

// Delete a booking
router.post("/:id/delete", async (req: Request, res: Response): Promise<void> => {
  const bookingRepo = AppDataSource.getRepository(Booking);
  const booking = await bookingRepo.findOneBy({ id: parseInt(req.params.id) });

  if (!booking) {
    res.status(404).send("Booking not found.");
    return
  }

  await bookingRepo.remove(booking);

  res.redirect(`/playgrounds/${booking.playground.id}`);
});

export default router;
