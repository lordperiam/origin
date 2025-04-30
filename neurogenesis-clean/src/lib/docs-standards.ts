/**
 * @fileoverview Documentation standards for the project
 * 
 * All exported functions, classes and interfaces must have JSDoc comments.
 * Examples below demonstrate the required format.
 */

/**
 * Interface for user data
 * @interface UserData
 */
export interface UserData {
  /** User's unique identifier */
  id: string;
  /** User's display name */
  name: string;
  /** User's email address */
  email: string;
}

/**
 * Retrieves user information from the database
 * @param {string} userId - The user's unique identifier
 * @returns {Promise<UserData>} The user's data
 * @throws {Error} If user not found or database error occurs
 * @example
 * ```ts
 * const user = await getUserData('user-123');
 * console.log(user.name);
 * ```
 */
export async function getUserData(userId: string): Promise<UserData> {
  // Implementation...
  return {
    id: userId,
    name: 'Example User',
    email: 'user@example.com'
  };
}