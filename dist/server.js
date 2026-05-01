"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("src/app"));
const env_config_1 = __importDefault(require("./app/config/env.config"));
const handleServerEvent_1 = __importDefault(require("./app/utils/handleServerEvent"));
const mongoose_1 = __importDefault(require("mongoose"));
let server;
const startServer = async () => {
    try {
        await mongoose_1.default.connect(env_config_1.default.DB_URL);
        console.log('Connected to Star Style Database');
        server = app_1.default.listen(env_config_1.default.PORT, () => {
            console.log(`Server is running on port ${env_config_1.default.PORT}`);
        });
        (0, handleServerEvent_1.default)(server);
    }
    catch (error) {
        console.error('Error during startup:', error);
    }
};
(async () => {
    await startServer();
})();
