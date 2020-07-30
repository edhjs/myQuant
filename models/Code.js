module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "code",
    {
      row_names: {
        type: DataTypes.STRING(10),

        allowNull: true,
        defaultValue: ""
      },
      code: {
        type: DataTypes.STRING(10),
        primaryKey: true,
        allowNull: false,
        defaultValue: ""
      },
      name: {
        type: DataTypes.STRING(30),
        allowNull: false,
        defaultValue: ""
      },
      market: {
        type: DataTypes.STRING(10),
        allowNull: false,
        defaultValue: ""
      }
    },
    {
      timestamps: false
    }
  );
};
