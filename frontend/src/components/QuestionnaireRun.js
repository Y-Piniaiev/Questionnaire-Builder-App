import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Container,
  Typography,
  Box,
  Button,
  Radio,
  RadioGroup,
  FormControlLabel,
  Checkbox,
  TextField,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as filestack from "filestack-js";

const QuestionnaireRun = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [questionnaire, setQuestionnaire] = useState(null);
  const [userAnswers, setUserAnswers] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [isCompleted, setIsCompleted] = useState(false);
  const [completionTime, setCompletionTime] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userAttempts, setUserAttempts] = useState([]);

  const filestackApiKey = process.env.REACT_APP_FILESTACK_API_KEY;
  const client = filestack.init(filestackApiKey);

  useEffect(() => {
    const fetchQuestionnaire = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/questionnaires/${id}`
        );
        setQuestionnaire(response.data);

        setUserAnswers(new Array(response.data.questions.length).fill(""));

        setLoading(false);
      } catch (error) {
        console.error("Error loading questionnaire:", error);
        setError("Failed to load questionnaire");
        setLoading(false);
      }
    };
    fetchQuestionnaire();
  }, [id]);

  const handleAnswerChange = (value) => {
    setUserAnswers((prevAnswers) => {
      const updatedAnswers = [...prevAnswers];
      updatedAnswers[currentQuestionIndex] = value;
      return updatedAnswers;
    });
  };

  const handleImageUpload = async () => {
    const options = {
      accept: ["image/*"],
      maxFiles: 1,
      transformations: {
        crop: false,
        circle: false,
        rotate: false,
      },
      onUploadDone: (res) => {
        if (res.filesUploaded.length > 0) {
          handleAnswerChange(res.filesUploaded[0].url);
        }
      },
    };

    client.picker(options).open();
  };

  const handleNext = () => {
    if (currentQuestionIndex < questionnaire.questions.length - 1) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleComplete = async () => {
    const completedAt = new Date();
    const completionTimeMs = completedAt.getTime() - startTime.getTime();
    setCompletionTime(completionTimeMs);

    try {
      const answersArray = questionnaire.questions.map((question, index) => ({
        questionId: question.id,
        questionText: question.questionText,
        questionType: question.questionType,
        answer:
          userAnswers[index] ||
          (question.questionType === "multiple_choice" ? [] : ""),
      }));

      const responseData = {
        questionnaireId: id,
        answers: answersArray,
        startedAt: startTime.toISOString(),
        completedAt: completedAt.toISOString(),
      };

      console.log("Sending response data:", responseData);
      await axios.post("http://localhost:5000/api/responses", responseData);

      const attemptsResponse = await axios.get(
        `http://localhost:5000/api/questionnaires/${id}/responses`
      );

      const sortedAttempts = attemptsResponse.data.sort((a, b) => {
        return new Date(a.startedAt) - new Date(b.startedAt);
      });

      setUserAttempts(sortedAttempts);
      setIsCompleted(true);
    } catch (error) {
      console.error("Error saving results:", error);
    }
  };

  const currentQuestion = questionnaire?.questions[currentQuestionIndex];

  const progress =
    ((currentQuestionIndex + 1) / (questionnaire?.questions.length || 1)) * 100;

  if (loading) {
    return (
      <Container>
        <Typography>Loading questionnaire...</Typography>
        <LinearProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error">{error}</Typography>
        <Button variant="contained" onClick={() => navigate("/")}>
          Return to Home
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      {!isCompleted ? (
        <>
          <Typography variant="h4" gutterBottom>
            {questionnaire.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            {questionnaire.description}
          </Typography>

          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              {currentQuestion.questionText}
            </Typography>

            {currentQuestion.questionType === "text" && (
              <TextField
                fullWidth
                value={userAnswers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
                margin="normal"
              />
            )}

            {currentQuestion.questionType === "single_choice" && (
              <RadioGroup
                value={userAnswers[currentQuestionIndex] || ""}
                onChange={(e) => handleAnswerChange(e.target.value)}
              >
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    value={option}
                    control={<Radio />}
                    label={option}
                  />
                ))}
              </RadioGroup>
            )}

            {currentQuestion.questionType === "multiple_choice" && (
              <>
                {currentQuestion.options.map((option, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={(
                          userAnswers[currentQuestionIndex] || []
                        ).includes(option)}
                        onChange={(e) => {
                          const currentValues =
                            userAnswers[currentQuestionIndex] || [];
                          const newValue = e.target.checked
                            ? [...currentValues, option]
                            : currentValues.filter((item) => item !== option);
                          handleAnswerChange(newValue);
                        }}
                      />
                    }
                    label={option}
                  />
                ))}
              </>
            )}

            {currentQuestion.questionType === "image" && (
              <>
                <Button
                  variant="contained"
                  onClick={handleImageUpload}
                  sx={{ mt: 2 }}
                >
                  Upload Image
                </Button>
                {userAnswers[currentQuestionIndex] && (
                  <img
                    src={userAnswers[currentQuestionIndex]}
                    alt="Uploaded"
                    style={{ width: "100px", marginTop: "10px" }}
                  />
                )}
              </>
            )}
          </Box>

          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3 }}>
            <Button
              variant="contained"
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < questionnaire.questions.length - 1 ? (
              <Button variant="contained" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button
                variant="contained"
                color="success"
                onClick={handleComplete}
              >
                Complete
              </Button>
            )}
          </Box>
        </>
      ) : (
        <Box>
          <Typography variant="h4" gutterBottom>
            Thank you for completing the questionnaire!
          </Typography>
          <Typography variant="body1" gutterBottom>
            Completion time: {(completionTime / 1000).toFixed(2)} seconds
          </Typography>

          <Typography variant="h6" gutterBottom>
            Your Attempts:
          </Typography>
          {userAttempts.map((attempt, attemptIndex) => (
            <Accordion key={attemptIndex}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>
                  Attempt #{attemptIndex + 1} -{" "}
                  {new Date(attempt.startedAt).toLocaleString()}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List>
                  {attempt.answers.map((answer, answerIndex) => (
                    <ListItem key={answerIndex}>
                      <ListItemText
                        primary={answer.questionText}
                        secondary={
                          answer.questionType === "image" ? (
                            <img
                              src={answer.answer}
                              alt="Answer"
                              style={{ width: "100px", marginTop: "10px" }}
                            />
                          ) : (
                            `Answer: ${answer.answer}`
                          )
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          ))}

          <Button variant="contained" onClick={() => navigate("/")}>
            Return to Home
          </Button>
        </Box>
      )}
    </Container>
  );
};

export default QuestionnaireRun;
