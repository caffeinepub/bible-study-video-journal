import Text "mo:core/Text";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import Iter "mo:core/Iter";
import Time "mo:core/Time";
import Int "mo:core/Int";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  type VideoEntry = {
    id : Text;
    title : Text;
    description : ?Text;
    bibleReference : ?Text;
    uploadDate : Int;
    uploadedBy : Principal;
    videoBlob : Storage.ExternalBlob;
  };

  module VideoEntry {
    public func compare(a : VideoEntry, b : VideoEntry) : Order.Order {
      Text.compare(a.id, b.id);
    };
  };

  let videoEntries = Map.empty<Text, VideoEntry>();

  public shared ({ caller }) func addVideoEntry(id : Text, title : Text, description : ?Text, bibleReference : ?Text, videoBlob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can upload videos");
    };
    if (title.isEmpty()) { Runtime.trap("Title cannot be empty!") };

    let newVideo : VideoEntry = {
      id;
      title;
      description;
      bibleReference;
      uploadDate = Time.now();
      uploadedBy = caller;
      videoBlob;
    };

    videoEntries.add(id, newVideo);
  };

  public shared ({ caller }) func deleteVideoEntry(videoId : Text) : async () {
    switch (videoEntries.get(videoId)) {
      case (null) {
        Runtime.trap("Video not found");
      };
      case (?video) {
        if (video.uploadedBy != caller and not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only the owner or admin can delete this video");
        };
        videoEntries.remove(videoId);
      };
    };
  };

  public query ({ caller }) func getAllVideos() : async [VideoEntry] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    videoEntries.values().toArray().sort();
  };

  public query ({ caller }) func getMyVideos() : async [VideoEntry] {
    videoEntries.values().filter(func(v : VideoEntry) : Bool { v.uploadedBy == caller }).toArray().sort();
  };

  public query ({ caller }) func getPublicFeedVideos() : async [VideoEntry] {
    videoEntries.values().toArray().sort(
      func(a, b) {
        Int.compare(b.uploadDate, a.uploadDate);
      }
    );
  };

  public query ({ caller }) func getVideo(id : Text) : async ?VideoEntry {
    videoEntries.get(id);
  };
};
