import { createTransport } from 'nodemailer'
import { smtpConfig } from '../config'
import smtpTransport from 'nodemailer-smtp-transport'

export default createTransport(smtpTransport(smtpConfig))
