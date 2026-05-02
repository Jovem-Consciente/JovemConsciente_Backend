import express from "express"
import prisma from "../prisma.js";
import { addConsultation, catchConsultation } from "../utils/consultation.js";
import { getAvailablePsychologist } from "../utils/consultation.js";




