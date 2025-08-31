const express = require('express');
const router = express.Router();

router.get('/api/courses/chinese/:level', async (req, res) => {
    try {
        const level = req.params.level;
        const data = await loadLevelData(level);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to load course data' });
    }
});

module.exports = router;