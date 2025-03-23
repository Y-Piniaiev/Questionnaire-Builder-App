const { admin } = require("../config/firebase");
const QuestionnaireModel = require("../models/Questionnaire");

exports.getQuestionnaires = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startAt = (page - 1) * limit;

    const totalSnapshot = await db.collection("questionnaires").count().get();
    const total = totalSnapshot.data().count;

    const snapshot = await db
      .collection("questionnaires")
      .orderBy("createdAt", "desc")
      .offset(startAt)
      .limit(limit)
      .get();

    const questionnaires =
      QuestionnaireModel.formatQuestionnaireCollection(snapshot);

    res.json({
      questionnaires,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.getQuestionnaireById = async (req, res) => {
  try {
    const doc = await db.collection("questionnaires").doc(req.params.id).get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Опитування не знайдено" });
    }

    const questionnaire = QuestionnaireModel.formatQuestionnaireDoc(doc);
    res.json(questionnaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.createQuestionnaire = async (req, res) => {
  try {
    const newQuestionnaire = QuestionnaireModel.createQuestionnaire(req.body);

    const docRef = await db.collection("questionnaires").add(newQuestionnaire);

    res.status(201).json({
      id: docRef.id,
      ...newQuestionnaire,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.updateQuestionnaire = async (req, res) => {
  try {
    const docRef = db.collection("questionnaires").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Опитування не знайдено" });
    }

    const existingData = doc.data();
    const updatedQuestionnaire = QuestionnaireModel.updateQuestionnaire(
      existingData,
      req.body
    );

    await docRef.update(updatedQuestionnaire);

    res.json({
      id: docRef.id,
      ...updatedQuestionnaire,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.deleteQuestionnaire = async (req, res) => {
  try {
    const docRef = db.collection("questionnaires").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Опитування не знайдено" });
    }

    await docRef.delete();

    res.json({ message: "Опитування успішно видалено" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};

exports.incrementCompletions = async (req, res) => {
  try {
    const docRef = db.collection("questionnaires").doc(req.params.id);
    const doc = await docRef.get();

    if (!doc.exists) {
      return res.status(404).json({ message: "Опитування не знайдено" });
    }

    await docRef.update({
      completions: admin.firestore.FieldValue.increment(1),
      updatedAt: new Date().toISOString(),
    });

    const updatedDoc = await docRef.get();
    const questionnaire = QuestionnaireModel.formatQuestionnaireDoc(updatedDoc);

    res.json(questionnaire);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Помилка сервера", error: error.message });
  }
};
