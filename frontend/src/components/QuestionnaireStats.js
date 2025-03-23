import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  CircularProgress,
} from "@mui/material";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const QuestionnaireStats = () => {
  const [statistics, setStatistics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/api/statistics"
        );
        setStatistics(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Помилка при завантаженні даних:", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF"];

  if (loading) {
    return (
      <Container>
        <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        General Statistics
      </Typography>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Average Completion Time
        </Typography>
        <Typography variant="body1">
          {statistics.averageCompletionTime} seconds
        </Typography>
      </Paper>

      <Grid container spacing={3} sx={{ mb: 3 }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Daily Completions
            </Typography>
            <Typography variant="body1">
              {statistics.completionsByPeriod.daily}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Weekly Completions
            </Typography>
            <Typography variant="body1">
              {statistics.completionsByPeriod.weekly}
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Monthly Completions
            </Typography>
            <Typography variant="body1">
              {statistics.completionsByPeriod.monthly}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {statistics.questionStats.map((question, index) => (
        <Box key={question.questionId} sx={{ mb: 5 }}>
          <Typography variant="h6" gutterBottom>
            {question.questionText} (from {question.questionnaireName})
          </Typography>
          {question.data.length === 0 ? (
            <Typography variant="body1">No answers yet.</Typography>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <BarChart
                  width={500}
                  height={300}
                  data={question.data}
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill={COLORS[index % COLORS.length]} />
                </BarChart>
              </Grid>
              <Grid item xs={12} md={6}>
                <PieChart width={400} height={300}>
                  <Pie
                    data={question.data}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    fill="#8884d8"
                    label
                  >
                    {question.data.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </Grid>
            </Grid>
          )}
        </Box>
      ))}
    </Container>
  );
};

export default QuestionnaireStats;
