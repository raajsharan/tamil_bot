import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';

const Calendar = sequelize.define(
  'Calendar',
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    date: {
      type: DataTypes.DATE,
      allowNull: false,
      unique: true,
      index: true,
    },
    dateString: {
      type: DataTypes.STRING(10),
      allowNull: false,
      unique: true,
      comment: 'YYYY-MM-DD format',
    },
    tamilDate: {
      type: DataTypes.STRING(100),
      allowNull: true,
      comment: 'Tamil calendar date',
    },
    tithi: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Tithi (lunar day) with name, start/end time',
    },
    nakshatram: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Nakshatram (star) with name, start/end time',
    },
    yogam: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Yoga with name, start/end time',
    },
    karanam: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Karanam with name, start/end time',
    },
    sunrise: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Sunrise time (HH:MM format)',
    },
    sunset: {
      type: DataTypes.STRING(10),
      allowNull: true,
      comment: 'Sunset time (HH:MM format)',
    },
    moonrise: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    moonset: {
      type: DataTypes.STRING(10),
      allowNull: true,
    },
    rahuKalam: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Rahu Kalam with start/end time',
    },
    yamaGhantai: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Yama Ghantai with start/end time',
    },
    guliKai: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Guli Kai with start/end time',
    },
    abhijit: {
      type: DataTypes.JSONB,
      defaultValue: {},
      comment: 'Abhijit Muhurtham with start/end time',
    },
    festivals: {
      type: DataTypes.JSONB,
      defaultValue: [],
      comment: 'Array of festivals on this date',
    },
    moonPhase: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Current moon phase',
    },
    moonPhasePercent: {
      type: DataTypes.FLOAT,
      allowNull: true,
      comment: 'Moon illumination percentage',
    },
    season: {
      type: DataTypes.STRING(50),
      allowNull: true,
      comment: 'Tamil season',
    },
    zodiacSign: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    dataSource: {
      type: DataTypes.STRING(100),
      defaultValue: 'scraped',
      comment: 'Source of data: scraped, manual, generated',
    },
    verified: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      comment: 'Data verified by admin',
    },
    notes: {
      type: DataTypes.TEXT,
      allowNull: true,
      comment: 'Admin notes about this date',
    },
    isHoliday: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    updated_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    timestamps: true,
    underscored: true,
    indexes: [
      {
        fields: ['date'],
      },
      {
        fields: ['dateString'],
      },
      {
        fields: ['verified'],
      },
    ],
  }
);

export default Calendar;
