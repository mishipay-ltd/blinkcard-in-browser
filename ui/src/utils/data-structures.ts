/**
 * Copyright (c) Microblink Ltd. All rights reserved.
 */

import { EventEmitter } from '@stencil/core';

import * as BlinkCardSDK from '@microblink/blinkcard-in-browser-sdk';

export { SDKError } from '@microblink/blinkcard-in-browser-sdk';

export interface MicroblinkUI {
  // SDK settings
  allowHelloMessage:     boolean;
  engineLocation:        string;
  licenseKey:            string;
  wasmType:              string;
  rawRecognizers:        string;
  recognizers:           Array<string>;
  recognizerOptions:     { [key: string]: any };
  recognitionTimeout?:   number;
  includeSuccessFrame?:  boolean;

  // Functional properties
  enableDrag:            boolean;
  hideFeedback:          boolean;
  hideLoadingAndErrorUi: boolean;
  scanFromCamera:        boolean;
  scanFromImage:         boolean;

  // Localization
  translations:          { [key: string]: string };
  rawTranslations:       string;

  // UI customization
  galleryOverlayType:                'FULLSCREEN' | 'INLINE';
  galleryDropType:                   'FULLSCREEN' | 'INLINE';
  showActionLabels:                  boolean;
  showModalWindows:                  boolean;
  showScanningLine?:                 boolean;
  showCameraFeedbackBarcodeMessage?: boolean;

  // Icons
  iconCameraDefault:                string;
  iconCameraActive:                 string;
  iconGalleryDefault:               string;
  iconGalleryActive:                string;
  iconInvalidFormat:                string;
  iconSpinnerScreenLoading:         string;
  iconSpinnerFromGalleryExperience: string;
  iconGalleryScanningCompleted:     string;

  // Events
  fatalError:         EventEmitter<BlinkCardSDK.SDKError>;
  ready:              EventEmitter<EventReady>;
  scanError:          EventEmitter<EventScanError>;
  scanSuccess:        EventEmitter<EventScanSuccess>;
  cameraScanStarted:  EventEmitter<null>;
  imageScanStarted:   EventEmitter<null>;

  // Methods
  setUiState:         (state: 'ERROR' | 'LOADING' | 'NONE' | 'SUCCESS') => Promise<any>;
  setUiMessage:       (state: 'FEEDBACK_ERROR' | 'FEEDBACK_INFO' | 'FEEDBACK_OK', message: string) => Promise<any>;
}

export interface SdkSettings {
  allowHelloMessage:  boolean;
  engineLocation:     string;
  wasmType?:          BlinkCardSDK.WasmType;
}

/**
 * Events
 */
export class EventReady {
  sdk: BlinkCardSDK.WasmSDK;

  constructor(sdk: BlinkCardSDK.WasmSDK) {
    this.sdk = sdk;
  }
}

export class EventScanError {
  code:           Code;
  fatal:          boolean;
  message:        string;
  recognizerName: string;
  details?:       any;

  constructor(code: Code, fatal: boolean, message: string, recognizerName: string, details?: any) {
    this.code = code;
    this.fatal = fatal;
    this.message = message;
    this.recognizerName = recognizerName;

    if (details) {
      this.details = details;
    }
  }
}

export class EventScanSuccess {
  recognizer:     BlinkCardSDK.RecognizerResult;
  recognizerName: string;
  successFrame?:  BlinkCardSDK.SuccessFrameGrabberRecognizerResult;

  constructor(
    recognizer: BlinkCardSDK.RecognizerResult,
    recognizerName: string,
    successFrame?: BlinkCardSDK.SuccessFrameGrabberRecognizerResult
  ) {
    this.recognizer = recognizer;
    this.recognizerName = recognizerName;

    if (successFrame) {
      this.successFrame = successFrame;
    }
  }
}

export interface RecognitionResults {
  recognizer: BlinkCardSDK.RecognizerResult,
  successFrame?: BlinkCardSDK.SuccessFrameGrabberRecognizerResult
}

/**
 * Error codes
 */
export enum Code {
  EmptyResult               = 'EMPTY_RESULT',
  InvalidRecognizerOptions  = 'INVALID_RECOGNIZER_OPTIONS',
  NoImageFileFound          = 'NO_IMAGE_FILE_FOUND',
  NoFirstImageFileFound     = 'NO_FIRST_IMAGE_FILE_FOUND',
  NoSecondImageFileFound    = 'NO_SECOND_IMAGE_FILE_FOUND',
  GenericScanError          = 'GENERIC_SCAN_ERROR',
  CameraNotAllowed          = 'CAMERA_NOT_ALLOWED',
  CameraInUse               = 'CAMERA_IN_USE',
  CameraGenericError        = 'CAMERA_GENERIC_ERROR',
}

/**
 * Scan structures
 */
export const AvailableRecognizers: { [key: string]: string } = {
  BlinkCardRecognizer:                  'createBlinkCardRecognizer',
}

export interface VideoRecognitionConfiguration {
  recognizers: Array<string>,
  recognizerOptions?: any,
  recognitionTimeout?: number,
  successFrame: boolean,
  cameraFeed: HTMLVideoElement,
  cameraId: string | null
}

export interface ImageRecognitionConfiguration {
  recognizers: Array<string>,
  recognizerOptions?: any,
  thoroughScan?: boolean,
  file: File
}

export interface CombinedImageRecognitionConfiguration {
  recognizers: Array<string>,
  recognizerOptions?: any,
  thoroughScan?: boolean,
  firstFile: File,
  secondFile: File
}

export enum ImageRecognitionType {
  Single   = 'Single',
  Combined = 'Combined'
}

export enum CombinedImageType {
  First  = 'First',
  Second = 'Second'
}

export interface RecognizerInstance {
  name: string,
  recognizer: BlinkCardSDK.Recognizer & { objectHandle: number },
  successFrame?: BlinkCardSDK.SuccessFrameGrabberRecognizer<BlinkCardSDK.Recognizer> & { objectHandle?: number }
}

export enum RecognitionStatus {
  NoImageFileFound          = 'NoImageFileFound',
  NoFirstImageFileFound     = 'NoFirstImageFileFound',
  NoSecondImageFileFound    = 'NoSecondImageFileFound',
  Preparing                 = 'Preparing',
  Ready                     = 'Ready',
  Processing                = 'Processing',
  DetectionFailed           = 'DetectionFailed',
  EmptyResultState          = 'EmptyResultState',
  OnFirstSideResult         = 'OnFirstSideResult',
  ScanSuccessful            = 'ScanSuccessful',
  DocumentClassified        = 'DocumentClassified',

  // Camera states
  DetectionStatusChange     = 'DetectionStatusChange',
  NoSupportForMediaDevices  = 'NoSupportForMediaDevices',
  CameraNotFound            = 'CameraNotFound',
  CameraNotAllowed          = 'CameraNotAllowed',
  UnableToAccessCamera      = 'UnableToAccessCamera',
  CameraInUse               = 'CameraInUse',
  CameraGenericError        = 'CameraGenericError',

  // Errors
  UnknownError              = 'UnknownError',

  // BlinkCardSDK.DetectionStatus
  DetectionStatusFail                   = 'Fail',
  DetectionStatusSuccess                = 'Success',
  DetectionStatusCameraTooHigh          = 'CameraTooHigh',
  DetectionStatusFallbackSuccess        = 'FallbackSuccess',
  DetectionStatusPartial                = 'Partial',
  DetectionStatusCameraAtAngle          = 'CameraAtAngle',
  DetectionStatusCameraTooNear          = 'CameraTooNear',
  DetectionStatusDocumentTooCloseToEdge = 'DocumentTooCloseToEdge'
}

export interface RecognitionEvent {
  status: RecognitionStatus,
  data?: any
}

export interface RecognitionResults {
  recognizer:     BlinkCardSDK.RecognizerResult,
  recognizerName: string,
  successFrame?:  BlinkCardSDK.SuccessFrameGrabberRecognizerResult,
  imageCapture?:  boolean,
  resultJSON?:    any
}

export enum CameraExperience {
  Barcode         = 'BARCODE',
  CardCombined    = 'CARD_COMBINED',
  CardSingleSide  = 'CARD_SINGLE_SIDE',
  PaymentCard     = 'PAYMENT_CARD'
}

export enum CameraExperienceState {
  AdjustAngle     = 'AdjustAngle',
  Classification  = 'Classification',
  Default         = 'Default',
  Detection       = 'Detection',
  Done            = 'Done',
  DoneAll         = 'DoneAll',
  Flip            = 'Flip',
  MoveCloser      = 'MoveCloser',
  MoveFarther     = 'MoveFarther'
}

export const CameraExperienceStateDuration = new Map([
  [ CameraExperienceState.AdjustAngle, 2500 ],
  [ CameraExperienceState.Default, 500 ],
  [ CameraExperienceState.Done, 300 ],
  [ CameraExperienceState.DoneAll, 400 ],
  [ CameraExperienceState.Flip, 4000 ],
  [ CameraExperienceState.MoveCloser, 2500 ],
  [ CameraExperienceState.MoveFarther, 2500 ]
]);

export enum CameraExperienceReticleAnimation {
  Default,
  Detection,
  Classification
}

/**
 * User feedback structures
 */
export enum FeedbackCode {
  CameraDisabled      = 'CAMERA_DISABLED',
  CameraGenericError  = 'CAMERA_GENERIC_ERROR',
  CameraInUse         = 'CAMERA_IN_USE',
  CameraNotAllowed    = 'CAMERA_NOT_ALLOWED',
  GenericScanError    = 'GENERIC_SCAN_ERROR',
  ScanStarted         = 'SCAN_STARTED',
  ScanUnsuccessful    = 'SCAN_UNSUCCESSFUL',
  ScanSuccessful      = 'SCAN_SUCCESSFUL'
}

export interface FeedbackMessage {
  code?   : FeedbackCode;
  state   : 'FEEDBACK_ERROR' | 'FEEDBACK_INFO' | 'FEEDBACK_OK';
  message : string;
}

/**
 * Camera selection
 */
export interface CameraEntry {
  prettyName: string;
  details: BlinkCardSDK.SelectedCamera | null;
}
