import React, { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Button,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  LinearProgress,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import PlayCircleOutlineIcon from "@mui/icons-material/PlayCircleOutline";

const QuestionnaireList = ({
  apiUrl = "http://localhost:5000/api/questionnaires",
}) => {
  const [questionnaires, setQuestionnaires] = useState([]);
  const [sortBy, setSortBy] = useState("name");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [questionnaireToDelete, setQuestionnaireToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchQuestionnaires = useCallback(
    async (reset = false) => {
      try {
        const response = await axios.get(apiUrl, {
          params: {
            page: reset ? 1 : page,
            limit: 10,
            sortBy,
          },
        });
        const newQuestionnaires = response.data.questionnaires;

        if (newQuestionnaires.length === 0) {
          setHasMore(false);
          return;
        }

        setQuestionnaires((prev) =>
          reset ? newQuestionnaires : [...prev, ...newQuestionnaires]
        );
        setLoading(false);
      } catch (error) {
        console.error("Помилка при отриманні опитувань:", error);
        setLoading(false);
      }
    },
    [apiUrl, page, sortBy]
  );

  useEffect(() => {
    setPage(1);
    setQuestionnaires([]);
    fetchQuestionnaires(true);
  }, [sortBy, fetchQuestionnaires]);

  const sortedQuestionnaires = React.useMemo(() => {
    return [...questionnaires].sort((a, b) => {
      if (sortBy === "name") {
        return a.name.localeCompare(b.name);
      } else if (sortBy === "questionCount") {
        return (b.questions?.length || 0) - (a.questions?.length || 0);
      } else if (sortBy === "completions") {
        return (b.completions || 0) - (a.completions || 0);
      }
      return 0;
    });
  }, [questionnaires, sortBy]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${apiUrl}/${id}`);
      setQuestionnaires(questionnaires.filter((q) => q.id !== id));
      setDeleteDialogOpen(false);
    } catch (error) {
      console.error("Помилка при видаленні опитування:", error);
    }
  };

  const openDeleteDialog = (id) => {
    setQuestionnaireToDelete(id);
    setDeleteDialogOpen(true);
  };

  const closeDeleteDialog = () => {
    setQuestionnaireToDelete(null);
    setDeleteDialogOpen(false);
  };

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop !==
        document.documentElement.offsetHeight ||
      loading ||
      !hasMore
    ) {
      return;
    }
    setPage((prevPage) => prevPage + 1);
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Questionnaire Catalog
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Sort By</InputLabel>
        <Select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          label="Sort By"
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="questionCount">Number of Questions</MenuItem>
          <MenuItem value="completions">Number of Completions</MenuItem>
        </Select>
      </FormControl>

      {loading && <LinearProgress sx={{ mb: 3 }} />}

      <Grid container spacing={3}>
        {sortedQuestionnaires.map((questionnaire) => (
          <Grid item key={questionnaire.id} xs={12} sm={6} md={4}>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {questionnaire.name}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                  {questionnaire.description}
                </Typography>
                <Typography variant="body2">
                  Questions: {questionnaire.questions?.length || 0}
                </Typography>
                <Typography variant="body2">
                  Completions: {questionnaire.completions || 0}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 2,
                  }}
                >
                  <IconButton
                    color="primary"
                    component={Link}
                    to={`/edit/${questionnaire.id}`}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    color="secondary"
                    onClick={() => openDeleteDialog(questionnaire.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <IconButton
                    color="success"
                    component={Link}
                    to={`/run/${questionnaire.id}`}
                  >
                    <PlayCircleOutlineIcon />
                  </IconButton>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={deleteDialogOpen} onClose={closeDeleteDialog}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this questionnaire?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteDialog} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => handleDelete(questionnaireToDelete)}
            color="secondary"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default QuestionnaireList;
