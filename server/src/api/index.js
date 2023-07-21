const router = require("express").Router();

const authMiddleware = require("../middlewares/authenticate");

const authRouter = require("./routes/authentication");
const liveRouter = require("./routes/live");
const dashboardRouter = require("./routes/dashboard");
const reportsRouter = require("./routes/reports");
const vehiclesRouter = require("./routes/vehicles");
const operatorRouter = require("./routes/operators");
const tokenRouter = require("./routes/token");
const templatesRouter = require("./routes/templates");
const usersRouter = require("./routes/users");
const sitesRouter = require("./routes/sites");
const systemHealthRouter = require("./routes/systemHealth");
const iqStatRouter = require("./routes/iqStats");
const goNeutralRouter = require("./routes/goNeutral");
const voiRouter = require("./routes/voi");
const scheduledReportsRouter = require("./routes/scheduledReports");
const evRouter = require("./routes/evSpecificData");
const excludeVrmRouter = require("./routes/excludeVrm");
const vrmCorrectionRouter = require("./routes/vrmCorrection");
const insightsRouter = require("./routes/insights");

// Protected routes
router.use("/live", authMiddleware, liveRouter);
router.use("/dashboard", authMiddleware, dashboardRouter);
router.use("/vehicles", authMiddleware, vehiclesRouter);
router.use("/reports", authMiddleware, reportsRouter);
router.use("/operators", authMiddleware, operatorRouter);
router.use("/templates", authMiddleware, templatesRouter);
router.use("/users", authMiddleware, usersRouter);
router.use("/sites", authMiddleware, sitesRouter);
router.use("/systemHealth", authMiddleware, systemHealthRouter);
router.use("/iqStats", authMiddleware, iqStatRouter);
router.use("/goNeutral", authMiddleware, goNeutralRouter);
router.use("/voi", authMiddleware, voiRouter);
router.use("/scheduledReports", authMiddleware, scheduledReportsRouter);
router.use("/evData", authMiddleware, evRouter);
router.use("/excludeVrm", authMiddleware, excludeVrmRouter);
router.use("/vrmCorrection",authMiddleware,vrmCorrectionRouter);
router.use("/insights",authMiddleware,insightsRouter);

// Unprotected routes
router.use("/auth", authRouter);
router.use("/token", tokenRouter);

module.exports = router;
