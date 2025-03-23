import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const QuestionnaireForm = ({ isEdit = false, id }) => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [questions, setQuestions] = useState([]);
  const [newQuestionText, setNewQuestionText] = useState("");
  const [newQuestionType, setNewQuestionType] = useState("text");
  const [newQuestionOptions, setNewQuestionOptions] = useState("");

  useEffect(() => {
    if (isEdit && id) {
      const fetchQuestionnaire = async () => {
        try {
          const response = await axios.get(
            `http://localhost:5000/api/questionnaires/${id}`
          );
          const { name, description, questions } = response.data;
          setName(name);
          setDescription(description);
          setQuestions(questions);
        } catch (error) {
          console.error("Помилка при завантаженні опитування:", error);
        }
      };
      fetchQuestionnaire();
    }
  }, [id, isEdit]);

  const addQuestion = () => {
    if (!newQuestionText) {
      alert("Будь ласка, введіть текст питання.");
      return;
    }

    if (
      (newQuestionType === "single_choice" ||
        newQuestionType === "multiple_choice") &&
      !newQuestionOptions
    ) {
      alert("Будь ласка, введіть варіанти відповідей.");
      return;
    }

    const newQuestion = {
      questionText: newQuestionText,
      questionType: newQuestionType,
      options:
        newQuestionType !== "text" && newQuestionType !== "image"
          ? newQuestionOptions.split(",")
          : [],
      order: questions.length + 1,
    };

    setQuestions([...questions, newQuestion]);
    setNewQuestionText("");
    setNewQuestionOptions("");
  };

  const deleteQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !description) {
      alert("Будь ласка, заповніть назву та опис опитування.");
      return;
    }

    if (questions.length === 0) {
      alert("Будь ласка, додайте хоча б одне питання.");
      return;
    }

    const questionnaireData = {
      name,
      description,
      questions,
    };

    try {
      if (isEdit && id) {
        await axios.put(
          `http://localhost:5000/api/questionnaires/${id}`,
          questionnaireData
        );
      } else {
        await axios.post(
          "http://localhost:5000/api/questionnaires",
          questionnaireData
        );
      }
      navigate("/");
    } catch (error) {
      console.error("Помилка при збереженні опитування:", error);
      alert("Сталася помилка при збереженні опитування. Спробуйте ще раз.");
    }
  };

  const onDragEnd = (result) => {
    if (!result.destination) return;

    const reorderedQuestions = Array.from(questions);
    const [movedQuestion] = reorderedQuestions.splice(result.source.index, 1);
    reorderedQuestions.splice(result.destination.index, 0, movedQuestion);

    setQuestions(reorderedQuestions);
  };

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        {isEdit ? "Edit Questionnaire" : "Create Questionnaire"}
      </Typography>

      <Box component="form" onSubmit={handleSubmit}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          fullWidth
          margin="normal"
          required
        />

        <TextField
          label="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          margin="normal"
          required
          multiline
          rows={4}
        />

        <Typography variant="h6" gutterBottom>
          Questions
        </Typography>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="questions">
            {(provided) => (
              <List {...provided.droppableProps} ref={provided.innerRef}>
                {questions.map((question, index) => (
                  <Draggable
                    key={index}
                    draggableId={`question-${index}`}
                    index={index}
                  >
                    {(provided) => (
                      <ListItem
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                      >
                        <ListItemText
                          primary={question.questionText}
                          secondary={
                            <>
                              <div>Type: {question.questionType}</div>
                              {question.options &&
                                question.options.length > 0 && (
                                  <div>
                                    Options: {question.options.join(", ")}
                                  </div>
                                )}
                            </>
                          }
                        />
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            onClick={() => deleteQuestion(index)}
                          >
                            <DeleteIcon />
                          </IconButton>
                          <div
                            {...provided.dragHandleProps}
                            style={{ cursor: "grab" }}
                          ></div>
                        </ListItemSecondaryAction>
                      </ListItem>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </List>
            )}
          </Droppable>
        </DragDropContext>

        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Add New Question
          </Typography>

          <TextField
            label="Question Text"
            value={newQuestionText}
            onChange={(e) => setNewQuestionText(e.target.value)}
            fullWidth
            margin="normal"
          />

          <FormControl fullWidth margin="normal">
            <InputLabel>Question Type</InputLabel>
            <Select
              value={newQuestionType}
              onChange={(e) => setNewQuestionType(e.target.value)}
              label="Question Type"
            >
              <MenuItem value="text">Text</MenuItem>
              <MenuItem value="single_choice">Single Choice</MenuItem>
              <MenuItem value="multiple_choice">Multiple Choice</MenuItem>
              <MenuItem value="image">Image</MenuItem>
            </Select>
          </FormControl>

          {(newQuestionType === "single_choice" ||
            newQuestionType === "multiple_choice") && (
            <TextField
              label="Options (comma-separated)"
              value={newQuestionOptions}
              onChange={(e) => setNewQuestionOptions(e.target.value)}
              fullWidth
              margin="normal"
            />
          )}

          <Button variant="contained" onClick={addQuestion} sx={{ mt: 2 }}>
            Add Question
          </Button>
        </Box>

        <Button
          type="submit"
          variant="contained"
          color="primary"
          sx={{ mt: 3 }}
        >
          Save Questionnaire
        </Button>
      </Box>
    </Container>
  );
};

export default QuestionnaireForm;
