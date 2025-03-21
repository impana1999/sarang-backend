const { generateAccessToken, generateRefreshToken, getAccessTokenExpiry, getRefreshTokenExpiry } = require("../services/jwt.service");

  

const generateUserTokenPayload = (user) => {
    console.log('generateUserTokenPayload user', user.id);
    const payload = {
        id: user.id,
        email: user.email,
        mobileNumber: user.mobileNumber,
        firstName: user.firstName,
        lastName: user.lastName,
        type: 'USER'
    };
    return payload;
};

const generateTokensObject = (userPayload) => {
    const tokens = {
        accessToken: generateAccessToken(userPayload),
        refreshToken: generateRefreshToken(userPayload),
        accessExpiryTime: getAccessTokenExpiry(),
        refreshExpiryTime: getRefreshTokenExpiry()
    };
    return tokens;
};

const generateAdminTokenPayload = (admin) => {
    const payload = {
        id: admin.id,
        email: admin.email,
        mobileNumber: admin.mobileNumber,
        firstName: admin.firstName,
        lastName: admin.lastName,
        type: 'ADMIN'
    };
    return payload;
};

const generateAdminTokensObject = (adminPayload) => {
    const tokens = {
        accessToken: generateAccessToken(adminPayload),
        refreshToken: generateRefreshToken(adminPayload),
        accessExpiryTime: getAccessTokenExpiry(),
        refreshExpiryTime: getRefreshTokenExpiry()
    };
    return tokens;
};

module.exports = {
    generateUserTokenPayload,
    generateTokensObject,
    generateAdminTokenPayload,
    generateAdminTokensObject
};
