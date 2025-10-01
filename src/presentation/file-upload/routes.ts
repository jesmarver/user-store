import { Router } from "express";
import { AuthMiddleware } from "../middlewares/auth.middleware";
import { CategoryService } from "../services/category.service";
import { FileUploadController } from "./controller";

export class FileUploadRoutes {

    static get routes(): Router {
        const router = Router();

        const controller = new FileUploadController();

        // api/upload/single/<user|category|product>/
        // api/upload/multiple/<user|category|product>/
        router.post('/single/:type', controller.uploadFile);
        router.post('/multiple/:type', controller.uploadMultipleFiles);

        return router;
    }
}