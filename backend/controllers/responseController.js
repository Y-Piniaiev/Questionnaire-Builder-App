const { admin } = require("../config/firebase");
const ResponseModel = require("../models/Response");

exports.saveResponse = async (req, res) => {
  try {
    const { questionnaireId, answers, startedAt, completedAt } = req.body;

    const questionnaireDoc = await db
      .collection("questionnaires")
      .doc(questionnaireId)
      .get();

    if (!questionnaireDoc.exists) {
      return res.status(404).json({ message: "Опитування не знайдено" });
    }

    const newResponse = ResponseModel.createResponse(req.body);

    const docRef = await db.collection("responses").add(newResponse);

    await db
      .collection("questionnaires")
      .doc(questionnaireId)
      .update({
        completions: admin.firestore.FieldValue.increment(1),
        updatedAt: new Date().toISOString(),
      });

    res.status(201).json({
      id: docRef.id,
      ...newResponse,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.getResponsesByQuestionnaire = async (req, res) => {
  try {
    const snapshot = await db
      .collection("responses")
      .where("questionnaireId", "==", req.params.id)
      .get();

    const responses = ResponseModel.formatResponseCollection(snapshot);
    res.json(responses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};
