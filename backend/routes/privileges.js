const router = require('express').Router();
const PrivilegeController = require('../controllers/PrivilegeController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(auth);
router.use(authorize(['admin'])); // Todas as rotas requerem admin

router.get('/', PrivilegeController.getPrivileges);
router.post('/', PrivilegeController.createPrivilege);
router.put('/:id', PrivilegeController.updatePrivilege);
router.delete('/:id', PrivilegeController.deletePrivilege);

module.exports = router;