import { useRef, useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext.jsx";

const Profile = () => {

  const { user } = useAuth();

  const fileInputRef = useRef(null);

  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || ""
  );

  const [previewImage, setPreviewImage] = useState(
    localStorage.getItem("profileImage") || ""
  );


  // =====================================================
  // SELECT PROFILE IMAGE
  // =====================================================

  const handleImageChange = (e) => {

    const file = e.target.files?.[0];

    if (!file) {
      return;
    }


    // Only image files
    if (!file.type.startsWith("image/")) {

      toast.error(
        "Please select a valid image file."
      );

      return;
    }


    // Maximum 2 MB
    if (file.size > 2 * 1024 * 1024) {

      toast.error(
        "Image size must be less than 2 MB."
      );

      return;
    }


    const reader = new FileReader();

    reader.onload = () => {

      const imageUrl = reader.result;

      setPreviewImage(imageUrl);
    };

    reader.readAsDataURL(file);
  };


  // =====================================================
  // SAVE PROFILE IMAGE
  // =====================================================

  const saveProfileImage = () => {

    if (!previewImage) {

      toast.error(
        "Please select a profile picture first."
      );

      return;
    }


    localStorage.setItem(
      "profileImage",
      previewImage
    );

    setProfileImage(previewImage);


    // Tell Layout.jsx that image changed
    window.dispatchEvent(
      new Event("profile-image-updated")
    );


    toast.success(
      "Profile picture updated successfully!"
    );
  };


  // =====================================================
  // REMOVE PROFILE IMAGE
  // =====================================================

  const removeProfileImage = () => {

    localStorage.removeItem(
      "profileImage"
    );

    setProfileImage("");

    setPreviewImage("");


    window.dispatchEvent(
      new Event("profile-image-updated")
    );


    toast.success(
      "Profile picture removed."
    );
  };


  const firstLetter = user?.name
    ? user.name.charAt(0).toUpperCase()
    : "U";


  return (

    <div>

      {/* =================================================
          PAGE HEADER
      ================================================= */}

      <div className="profile-page-header">

        <div>

          <span className="profile-eyebrow">
            ACCOUNT
          </span>

          <h1>
            Profile Settings
          </h1>

          <p>
            Manage your personal account information.
          </p>

        </div>

      </div>


      {/* =================================================
          PROFILE CONTENT
      ================================================= */}

      <div className="row g-4">


        {/* =================================================
            LEFT PROFILE CARD
        ================================================= */}

        <div className="col-xl-4">

          <div className="profile-main-card">

            {/* PROFILE COVER */}

            <div className="profile-cover">

              <div className="cover-pattern"></div>

            </div>


            {/* PROFILE IMAGE */}

            <div className="profile-image-area">

              <div className="profile-image-wrapper">

                {previewImage ? (

                  <img
                    src={previewImage}
                    alt="Profile"
                    className="profile-image"
                  />

                ) : (

                  <div className="profile-letter">

                    {firstLetter}

                  </div>

                )}


                {/* Camera Button */}

                <button
                  type="button"
                  className="camera-button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  title="Change profile picture"
                >

                  <i className="bi bi-camera-fill"></i>

                </button>

              </div>


              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={handleImageChange}
              />

            </div>


            {/* USER DETAILS */}

            <div className="profile-main-info">

              <h2>
                {user?.name}
              </h2>

              <p>
                {user?.email}
              </p>

              <span className="profile-status">

                <span className="status-dot"></span>

                Active Account

              </span>

            </div>


            {/* PHOTO BUTTONS */}

            <div className="profile-photo-actions">

              <button
                type="button"
                className="btn btn-primary profile-action-btn"
                onClick={saveProfileImage}
              >

                <i className="bi bi-check-circle me-2"></i>

                Save Photo

              </button>


              {profileImage && (

                <button
                  type="button"
                  className="btn btn-outline-danger profile-action-btn"
                  onClick={removeProfileImage}
                >

                  <i className="bi bi-trash3 me-2"></i>

                  Remove

                </button>

              )}

            </div>


            <div className="profile-photo-help">

              <i className="bi bi-info-circle me-1"></i>

              JPG, PNG or WEBP. Maximum size 2 MB.

            </div>

          </div>

        </div>


        {/* =================================================
            RIGHT ACCOUNT CARD
        ================================================= */}

        <div className="col-xl-8">

          <div className="profile-details-card">

            {/* HEADER */}

            <div className="profile-card-header">

              <div>

                <span className="profile-section-label">
                  PERSONAL INFORMATION
                </span>

                <h3>
                  Account Information
                </h3>

                <p>
                  Your basic account details.
                </p>

              </div>

              <div className="profile-header-icon">

                <i className="bi bi-person-vcard"></i>

              </div>

            </div>


            {/* DETAILS */}

            <div className="row g-4 mt-1">


              {/* NAME */}

              <div className="col-md-6">

                <div className="profile-info-box">

                  <div className="profile-info-icon blue">

                    <i className="bi bi-person"></i>

                  </div>

                  <div>

                    <span>
                      Full Name
                    </span>

                    <strong>
                      {user?.name}
                    </strong>

                  </div>

                </div>

              </div>


              {/* EMAIL */}

              <div className="col-md-6">

                <div className="profile-info-box">

                  <div className="profile-info-icon green">

                    <i className="bi bi-envelope"></i>

                  </div>

                  <div>

                    <span>
                      Email Address
                    </span>

                    <strong>
                      {user?.email}
                    </strong>

                  </div>

                </div>

              </div>


              {/* ACCOUNT TYPE */}

              <div className="col-md-6">

                <div className="profile-info-box">

                  <div className="profile-info-icon purple">

                    <i className="bi bi-person-badge"></i>

                  </div>

                  <div>

                    <span>
                      Account Type
                    </span>

                    <strong>
                      Personal Account
                    </strong>

                  </div>

                </div>

              </div>


              {/* SECURITY */}

              <div className="col-md-6">

                <div className="profile-info-box">

                  <div className="profile-info-icon orange">

                    <i className="bi bi-shield-check"></i>

                  </div>

                  <div>

                    <span>
                      Account Security
                    </span>

                    <strong>
                      Password Protected
                    </strong>

                  </div>

                </div>

              </div>


            </div>


            {/* DIVIDER */}

            <hr className="profile-divider" />


            {/* ACCOUNT SECURITY INFO */}

            <div className="security-box">

              <div className="security-icon">

                <i className="bi bi-shield-lock-fill"></i>

              </div>

              <div>

                <h5>
                  Your account is protected
                </h5>

                <p>
                  Your login credentials are securely
                  protected with authentication.
                </p>

              </div>

            </div>

          </div>


          {/* =================================================
              QUICK PROFILE INFO
          ================================================= */}


        </div>

      </div>

    </div>
  );
};

export default Profile;