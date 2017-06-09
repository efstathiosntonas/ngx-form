let express  = require('express'),
    auth     = require('../controllers/auth.controller'),
    user     = require('../controllers/user.controller'),
    admin    = require('../controllers/admin.controller'),
    forms    = require('../controllers/forms.controller'),
    passport = require('passport');

let requireAuth = passport.authenticate('jwt', {session: false});

module.exports = (app) => {

  app.use(passport.initialize());
  require('../config/passport')(passport);

  // Initializing route groups
  let apiRoutes   = express.Router(),
      authRoutes  = express.Router(),
      adminRoutes = express.Router(),
      userRoutes  = express.Router(),
      formRoutes  = express.Router();

  //= ========================
  // Auth Routes
  //= ========================

  // User Auth Routes endpoint: http://localhost:3000/api/auth
  apiRoutes.use('/auth', authRoutes);

  // Register endpoint: http://localhost:3000/api/auth/register
  authRoutes.post('/register', auth.registerUser);

  // Login endpoint: http://localhost:3000/api/auth/login
  authRoutes.post('/login', auth.loginUser);

  // Forget Password endpoint: http://localhost:3000/api/auth/password
  authRoutes.post('/password', auth.forgetPassword);

  // Check if password reset token is not expired. endpoint: http://localhost:3000/api/auth/reset/:token
  authRoutes.get('/reset/:token', auth.verifyPasswordResetToken);

  // If password reset token is valid (not expired) then proceed to password change. endpoint: http://localhost:3000/api/auth/reset/:token
  authRoutes.post('/reset/:token', auth.changePassword);

  //= ========================
  // User Routes
  //= ========================

  apiRoutes.use('/user', userRoutes);

  // Get User Info endpoint: http://localhost:3000/api/user/:id
  userRoutes.get('/:id', requireAuth, user.getUserInfo);

  // Change user password from front end (not via email, via form)
  userRoutes.post('/password', requireAuth, user.changePassword);

  // Upload image endpoint: http://localhost:3000/api/user/image
  userRoutes.post('/image', requireAuth, user.uploadImage);

  // Delete Image endpoint: http://localhost:3000/api/user/image/:id
  userRoutes.delete('/image/:id', requireAuth, user.deleteImage);

  //= ========================
  // User Forms Routes
  //= ========================

  apiRoutes.use('/forms', formRoutes);

  // Get All Forms endpoint: http://localhost:3000/api/forms/user/:id
  formRoutes.get('/user/:id', requireAuth, forms.getAllForms);

  // Add new Form endpoint: http://localhost:3000/api/forms/
  formRoutes.post('/', requireAuth, forms.newForm);

  // Get Single Form endpoint: http://localhost:3000/api/forms/:id
  formRoutes.get('/:id', requireAuth, forms.getSingleForm);

  // Edit Single Form endpoint: http://localhost:3000/api/forms/:id
  formRoutes.patch('/:id', requireAuth, forms.editSingleForm);

  // Delete Single Form endpoint: http://localhost:3000/api/forms/:id
  formRoutes.delete('/:id', requireAuth, forms.deleteSingleForm);

  // Upload image endpoint: http://localhost:3000/api/forms/image
  formRoutes.post('/image', requireAuth, forms.uploadImage);

  // Delete Image endpoint: http://localhost:3000/api/forms/image/:id
  formRoutes.delete('/image/:id', requireAuth, forms.deleteImage);

  //= ========================
  // Administrator Routes
  //= ========================

  // Admin endpoint: http://localhost:3000/api/admin
  apiRoutes.use('/admin', adminRoutes);

  // Get All Users Forms, endpoint: http://localhost:3000/api/admin/forms
  adminRoutes.get('/forms', requireAuth, admin.getAllForms);

  // Get Single Form, endpoint: http://localhost:3000/api/admin/form/:id
  adminRoutes.get('/form/:id', requireAuth, admin.getSingleForm);

  // Delete Single Form, endpoint: http://localhost:3000/api/admin/form/:id
  adminRoutes.delete('/form/:id', requireAuth, admin.deleteSingleForm);

  // Edit Form, endpoint: http://localhost:3000/api/admin/form/:id
  adminRoutes.patch('/form/:id', requireAuth, admin.editForm);

  // Upload image endpoint: http://localhost:3000/api/admin/form/image
  formRoutes.post('/form/image', requireAuth, admin.uploadImage);

  // Delete Image endpoint: http://localhost:3000/api/admin/form/image/:id
  formRoutes.delete('/form/image/:id', requireAuth, admin.deleteImage);

  // Set url for API group routes, all endpoints start with /api/ eg http://localhost:3000/api/admin  || http://localhost:3000/api/auth
  app.use('/api', apiRoutes);
};

