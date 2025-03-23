const QuestionnaireModel = require("../models/Questionnaire");
const ResponseModel = require("../models/Response");

exports.getGeneralStatistics = async (req, res) => {
  try {
    const questionnairesSnapshot = await db.collection("questionnaires").get();
    const questionnaires = QuestionnaireModel.formatQuestionnaireCollection(
      questionnairesSnapshot
    );

    const responsesSnapshot = await db.collection("responses").get();
    const responses = ResponseModel.formatResponseCollection(responsesSnapshot);

    const totalCompletionTime = responses.reduce(
      (sum, response) => sum + response.completionTime,
      0
    );
    const averageCompletionTime =
      responses.length > 0
        ? (totalCompletionTime / responses.length / 1000).toFixed(2)
        : 0;

    const now = new Date();
    const today = new Date(now);
    today.setHours(0, 0, 0, 0);

    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - now.getDay());
    weekStart.setHours(0, 0, 0, 0);
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    const daily = responses.filter((response) => {
      const responseDate = new Date(response.completedAt);
      return responseDate >= today;
    }).length;

    const weekly = responses.filter((response) => {
      const responseDate = new Date(response.completedAt);
      return responseDate >= weekStart;
    }).length;

    const monthly = responses.filter((response) => {
      const responseDate = new Date(response.completedAt);
      return responseDate >= monthStart;
    }).length;

    const questionStats = [];
    questionnaires.forEach((questionnaire) => {
      questionnaire.questions.forEach((question) => {
        const answerCounts = {};
        responses.forEach((response) => {
          if (response.questionnaireId === questionnaire.id) {
            const answer = response.answers.find(
              (a) => a.questionId === question.id
            );
            if (answer) {
              if (question.questionType === "text") {
                answerCounts["Text Answers"] =
                  (answerCounts["Text Answers"] || 0) + 1;
              } else if (
                question.questionType === "single_choice" ||
                question.questionType === "multiple_choice"
              ) {
                const answers = Array.isArray(answer.answer)
                  ? answer.answer
                  : [answer.answer];
                answers.forEach((a) => {
                  answerCounts[a] = (answerCounts[a] || 0) + 1;
                });
              }
            }
          }
        });

        questionStats.push({
          questionnaireId: questionnaire.id,
          questionnaireName: questionnaire.name,
          questionId: question.id,
          questionText: question.questionText,
          data: Object.keys(answerCounts).map((key) => ({
            name: key,
            value: answerCounts[key],
          })),
        });
      });
    });

    res.json({
      averageCompletionTime,
      completionsByPeriod: { daily, weekly, monthly },
      questionStats,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};
