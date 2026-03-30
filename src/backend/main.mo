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

  // Only admin (the owner) can upload videos
  public shared ({ caller }) func addVideoEntry(id : Text, title : Text, description : ?Text, bibleReference : ?Text, videoBlob : Storage.ExternalBlob) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only the admin can upload videos");
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
        if (not (AccessControl.isAdmin(accessControlState, caller))) {
          Runtime.trap("Unauthorized: Only the admin can delete videos");
        };
        videoEntries.remove(videoId);
      };
    };
  };

  public query ({ caller }) func getAllVideos() : async [VideoEntry] {
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
