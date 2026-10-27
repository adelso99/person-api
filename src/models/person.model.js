import { DataTypes } from 'sequelize';

const definePersonModel = (sequelize) => {
    return sequelize.define(
        'Person',
        {
            person_id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            names: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            lastname: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },
            active: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: true,
            },
        },
        {
            tableName: 'person',
            schema: 'dbo',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        }
    );
};

export { definePersonModel };