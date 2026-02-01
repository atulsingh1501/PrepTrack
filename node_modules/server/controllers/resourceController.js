import Resource from '../models/Resource.js';

export const getResources = async (req, res) => {
  try {
    const resources = await Resource.find({ user: req.user._id });
    res.json(resources);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const createResource = async (req, res) => {
  try {
    const { title, url, type, topic } = req.body;
    let filePath = '';
    
    // If a local file is uploaded via multer
    if (req.file) {
      filePath = `/${req.file.path.replace(/\\/g, '/')}`; // Normalize for windows
    }

    const resource = await Resource.create({
      user: req.user._id, title, url, type, topic, filePath
    });
    res.status(201).json(resource);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(resource);
  } catch (error) { res.status(500).json({ message: error.message }); }
};

export const deleteResource = async (req, res) => {
  try {
    await Resource.findByIdAndDelete(req.params.id);
    res.json({ message: 'Removed' });
  } catch (error) { res.status(500).json({ message: error.message }); }
};
