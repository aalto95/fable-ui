const itemService = require("../services/itemService");

class ItemController {
  async saveItem(req, res, next) {
    try {
      const { name, status, description } = req.body;

      const result = await itemService.saveItem({
        name,
        status,
        description,
      });

      res.status(200).json({
        success: true,
        message: "Item saved successfully",
        data: result.data,
      });
    } catch (error) {
      next(error);
    }
  }
}

module.exports = new ItemController();
