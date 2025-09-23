// src/controllers/UserController.js
const connection = require('../db/connection.js');
const bcrypt = require('bcryptjs');

module.exports = {
  async create(request, response) {
    const { name, email, password } = request.body;
    
    // CORRIGIDO: O nome da variável agora corresponde ao da base de dados
    const hashedPassword = await bcrypt.hash(password, 8);

    try {
      await connection('users').insert({
        name,
        email,
        // CORRIGIDO: O nome da coluna é 'password'
        password: hashedPassword, 
      });

      return response.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
      console.error(error);
      return response.status(400).json({ error: 'Erro ao cadastrar usuário. Verifique se o email já existe.' });
    }
  }, // <-- CORRIGIDO: A barra foi trocada por uma vírgula

  async update(request, response) {
    const { id } = request.params;
    const { oldPassword, password } = request.body;
    const user_id_from_token = request.userId;

    // 1. Garante que o utilizador só pode alterar o seu próprio perfil
    if (Number(id) !== user_id_from_token) {
        return response.status(403).json({ error: 'Acesso negado.' });
    }

    // Nota: Não é preciso importar connection e bcrypt novamente aqui dentro
    try {
        const user = await connection('users').where('id', id).first();
        if (!user) {
            return response.status(404).json({ error: 'Utilizador não encontrado.' });
        }

        // 2. Verifica se a senha antiga está correta
        if (oldPassword) {
            // Compara a senha enviada com a senha do banco de dados (user.password)
            const isPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
            if (!isPasswordCorrect) {
                return response.status(400).json({ error: 'A senha antiga está incorreta.' });
            }
        } else {
            return response.status(400).json({ error: 'A senha antiga é obrigatória.' });
        }
        
        // 3. Encripta e atualiza a nova senha
        const newHashedPassword = await bcrypt.hash(password, 8);
        
        await connection('users').where('id', id).update({
            password: newHashedPassword
        });

        return response.status(204).send();

    } catch (error) {
        console.error(error); // Bom para ver erros no log da Render
        return response.status(500).json({ error: 'Erro interno ao atualizar a senha.' });
    }
  }
};