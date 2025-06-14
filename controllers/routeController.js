import Route from "../models/Route.js";

// GET all routes (bus/train)
export const getAllRoutes = async (req, res) => {
  try {
    const routes = await Route.find();
    res.status(200).json(routes);
  } catch (err) {
    res.status(500).json({ message: "Error fetching routes", error: err });
  }
};
