export enum errors {
  // Common Errors
  ACCESS_DENIED = "Access Denied: You do not have permission.",
  MISSING_OR_INVALID_TOKEN = "Missing or Invalid Token.",
  INVALID_OR_EXPIRED_TOKEN = "Invalid or Expired Token.",
  ACCOUNT_IS_DEACTIVATED = "Your account is deactivated, contact your administrator.",
  INCORRECT_EMAIL_OR_PASSWORD = "You have entered incorrect username or password.",

  // User related Errors
  INVALID_USER_ID = "Invalid user ID",
  EMAIL_IS_REQUIRED = "Email is required",
  USER_DOES_NOT_EXISTS = "This user does not exists.",
  RESTAURANT_ID_IS_REQUIRED = "Restaurant Id is required.",
  SUPERUSER_CREATION_IS_NOT_ALLOWED = "You can create a super user.",
  EMAIL_UPDATE_IS_NOT_ALLOWED = "You cannot update a user's email.",
  RESTAURANT_UPDATE_IS_NOT_ALLOWED = "You cannot update user's restaurant. Contact your administrator to perform this action.",
  CANNOT_UPDATE_SELF_ROLE = "You cannot update your own role.",
  CANNOT_UPDATE_SELF_RESTAURANT = "You cannot update your own restaurant.",
  CANNOT_UPDATE_SELF_ACTIVE_STATUS = "You cannot update your own active status.",
  CANNOT_UPDATE_SELF_SUPERUSER_STATUS = "You cannot update your own super user status.",
  CANNOT_UPDATE_USER_SUPERUSER_STATUS = "You cannot update a user's super user status.",

  // Restaurants related error
  RESTAURANT_DOES_NOT_EXISTS = "This restaurant does not exists.",

}
