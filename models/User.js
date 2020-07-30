module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "users",
    {
      id: {
        type: DataTypes.STRING(30),
        primaryKey: true,
        allowNull: false,
        defaultValue: ""
      },
      nickname: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: ""
      },
      profile_image: {
        type: DataTypes.STRING(100),
        allowNull: false,
        defaultValue: ""
      },
      //status 0: active 1: disable
      status: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      company: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: ""
      },
      accessToken: {
        type: DataTypes.STRING(400),
        allowNull: false,
        defaultValue: ""
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
        defaultValue: ""
      }
    },
    {
      timestamps: true
    }
  );
};
