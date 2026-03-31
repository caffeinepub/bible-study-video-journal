import AccessControl "./access-control";
import Prim "mo:prim";

mixin (accessControlState : AccessControl.AccessControlState) {
  // Initialize auth — the first caller automatically becomes admin.
  // The secret parameter is accepted for API compatibility but is no longer
  // required; admin status is granted based on being the first to sign in.
  public shared ({ caller }) func _initializeAccessControlWithSecret(userSecret : Text) : async () {
    let adminToken : Text = switch (Prim.envVar<system>("CAFFEINE_ADMIN_TOKEN")) {
      case (null) { "" };
      case (?t) { t };
    };
    AccessControl.initialize(accessControlState, caller, adminToken, userSecret);
  };

  public query ({ caller }) func getCallerUserRole() : async AccessControl.UserRole {
    AccessControl.getUserRole(accessControlState, caller);
  };

  public shared ({ caller }) func assignCallerUserRole(user : Principal, role : AccessControl.UserRole) : async () {
    // Admin-only check happens inside
    AccessControl.assignRole(accessControlState, caller, user, role);
  };

  public query ({ caller }) func isCallerAdmin() : async Bool {
    AccessControl.isAdmin(accessControlState, caller);
  };
};
