const express = require("express");
const router = express.Router();

const questionnaireController = require("../controllers/questionnaireController");
const responseController = require("../controllers/responseController");
const statisticsController = require("../controllers/statisticsController");

router.get("/questionnaires", questionnaireController.getQuestionnaires);
router.get("/questionnaires/:id", questionnaireController.getQuestionnaireById);
router.post("/questionnaires", questionnaireController.createQuestionnaire);
router.put("/questionnaires/:id", questionnaireController.updateQuestionnaire);
router.delete(
  "/questionnaires/:id",
  questionnaireController.deleteQuestionnaire
);
router.post(
  "/questionnaires/:id/increment-completions",
  questionnaireController.incrementCompletions
);

router.post("/responses", responseController.saveResponse);
router.get(
  "/questionnaires/:id/responses",
  responseController.getResponsesByQuestionnaire
);

router.get("/statistics", statisticsController.getGeneralStatistics);

module.exports = router;
