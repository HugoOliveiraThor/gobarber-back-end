import User from '../models/User';
import File from '../models/Files';

class ProviderController {
  async index(req, res) {
    const providers = await User.findAll({
      where: { provider: true },
      attributes: ['id', 'name', 'email', 'avatar_id'],
      include: [
        {
          model: File,
          as: 'avatar', // this as is create in model User associate
          attributes: ['name', 'path', 'url'],
        },
      ], // We can use any relationships we want
    });
    return res.json(providers);
  }
}

export default new ProviderController();
