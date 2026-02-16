import {
  createOrUpdatePerformance,
  getPerformanceByMonth,
  getEmployeePerformance
} from "./performance.service.js";

export const savePerformance = async (req, res) => {
  try {
    const performance = await createOrUpdatePerformance(req.body);
    res.status(201).json(performance);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

export const fetchPerformanceByMonth = async (req, res) => {
  try {
    const { month, company } = req.query;

    const data = await getPerformanceByMonth(
      Number(month),
      company
    );

    res.json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const fetchEmployeePerformance = async (req, res) => {
  const data = await getEmployeePerformance(req.params.id);
  res.json(data);
};
