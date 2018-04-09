const roles = {
  staff: 'staff',
  driver: 'driver',
  passenger: 'passenger'
};
const rolesRedirect = {
  staff: '/login/admin',
  driver: '/login/driver',
  passenger: '/login'
};
// selectively decide where to redirect based on allowed roles
// choose lowest level of access required
function chooseRedirect(allowedRoles) {
  if (allowedRoles.includes('passenger'))
    return rolesRedirect.passenger;
  if (allowedRoles.includes('driver'))
    return rolesRedirect.driver;
  if (allowedRoles.includes('staff'))
    return rolesRedirect.staff;
}
module.exports = {
  roles: roles,
  allow: (allowedRoles) => {
    return (req, res, next) => {
      console.log('authorizer allowing', allowedRoles, req.isAuthenticated());
      if (req.isAuthenticated() && allowedRoles.includes(req.user.role))
        return next();
      console.log('authorizer failed to authorize, redirecting');
      res.redirect(chooseRedirect(allowedRoles));
      }
    }
};