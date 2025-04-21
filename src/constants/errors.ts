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
  RESTAURANT_NOT_SELECTED = "Please select a restaurant.",
  RESTAURANT_ACCESS_DENIED = "You do not have access to this restaurant.",

  // Tables related errors
  TABLE_DOES_NOT_EXISTS = "This table does not exists.",
  TABLE_ACCES_DENIED = "You do not have access to this table.",

  // Table Categories related errors
  TABLE_CATEGORY_DOES_NOT_EXISTS = "This table category does not exists.",
  TABLE_CATEGORY_ACCES_DENIED = "You do not have access to this table category.",

  // Menu related errors
  MENU_DOES_NOT_EXISTS = "This Menu does not exists.",
  MENU_ACCES_DENIED = "You do not have access to this Menu.",

  // Menu Categories related errors
  MENU_ITEM_CATEGORY_DOES_NOT_EXISTS = "This Menu Item Category does not exists.",
  MENU_ITEM_CATEGORY_ACCES_DENIED = "You do not have access to this Menu Item Category.",
  
}
