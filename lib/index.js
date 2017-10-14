var parseString = require('xml2js').parseString,
    createClient = require('soap').createClient,
    path = require('path'),
    util = require('util');

function FedEx(args) {
    var $this = this;
    var defaults = {
        imperial: true, // for inches/lbs, false for metric cm/kgs
        compatible: false,
        currency: 'USD',
        language: 'en-US',
        environment: 'sandbox',
        parentKey: '', //Compatible Users Only
        parentPass: '',//Compatible Users Only
        key: '',
        password: '',
        account_number: '',
        meter_number: '',
        debug: false,
        pretty: false,
        user_agent: 'Logistix'
    };
    $this.hosts = {
        sandbox: 'https://wsbeta.fedex.com',
        live: 'https://ws.fedex.com'
    };

    var resources = {
        /* AddressValidationService */
        addressValidation: {
            f: buildRequest,
            r: handleResponse,
            method: 'addressValidation',
            wsdl: 'AddressValidationService_v4.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'aval',
                Major: 4,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* ASYNCService */
        retrieveJobResults: {
            f: buildRequest,
            r: handleResponse,
            method: 'retrieveJobResults',
            wsdl: 'ASYNCService_v4.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'async',
                Major: 4,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* CountryService */
        validatePostal: {
            f: buildRequest,
            r: handleResponse,
            method: 'validatePostal',
            wsdl: 'CountryService_v6.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'cnty',
                Major: 6,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* CloseService */
        closeWithDocuments: {
            f: buildRequest,
            r: handleResponse,
            method: 'closeWithDocuments',
            wsdl: 'CloseService_v5.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'clos',
                Major: 5,
                Intermediate: 0,
                Minor: 0
            }
        },
        groundClose: {
            f: buildRequest,
            r: handleResponse,
            method: 'groundClose',
            wsdl: 'CloseService_v5.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'clos',
                Major: 5,
                Intermediate: 0,
                Minor: 0
            }
        },
        groundCloseReportsReprint: {
            f: buildRequest,
            r: handleResponse,
            method: 'groundCloseReportsReprint',
            wsdl: 'CloseService_v5.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'clos',
                Major: 5,
                Intermediate: 0,
                Minor: 0
            }
        },
        groundCloseWithDocuments: {
            f: buildRequest,
            r: handleResponse,
            method: 'groundCloseWithDocuments',
            wsdl: 'CloseService_v5.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'clos',
                Major: 5,
                Intermediate: 0,
                Minor: 0
            }
        },
        reprintGroundCloseDocuments: {
            f: buildRequest,
            r: handleResponse,
            method: 'reprintGroundCloseDocuments',
            wsdl: 'CloseService_v5.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'clos',
                Major: 5,
                Intermediate: 0,
                Minor: 0
            }
        },
        smartPostClose: {
            f: buildRequest,
            r: handleResponse,
            method: 'smartPostClose',
            wsdl: 'CloseService_v5.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'clos',
                Major: 5,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* DangerousGoodsDataService (DGDS) */
        addDangerousGoodsHandlingUnit: {
            f: buildRequest,
            r: handleResponse,
            method: 'addDangerousGoodsHandlingUnit',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },
        deleteDangerousGoods: {
            f: buildRequest,
            r: handleResponse,
            method: 'deleteDangerousGoods',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },
        deleteDangerousGoodsHandlingUnit: {
            f: buildRequest,
            r: handleResponse,
            method: 'deleteDangerousGoodsHandlingUnit',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },
        modifyDangerousGoodsHandlingUnit: {
            f: buildRequest,
            r: handleResponse,
            method: 'modifyDangerousGoodsHandlingUnit',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },
        modifyDangerousGoodsShipment: {
            f: buildRequest,
            r: handleResponse,
            method: 'modifyDangerousGoodsShipment',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },
        retrieveDangerousGoods: {
            f: buildRequest,
            r: handleResponse,
            method: 'retrieveDangerousGoods',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },
        uploadDangerousGoods: {
            f: buildRequest,
            r: handleResponse,
            method: 'uploadDangerousGoods',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },
        validateDangerousGoods: {
            f: buildRequest,
            r: handleResponse,
            method: 'validateDangerousGoods',
            wsdl: 'DGDS_v3.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 3,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* DangerousGoodsListDetail (DGLDService) */
        listDangerousGoods: {
            f: buildRequest,
            r: handleResponse,
            method: 'listDangerousGoods',
            wsdl: 'DGLD_v1.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'dgds',
                Major: 1,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* InFlightShipmentService (IFSS) */
        processDelivery: {
            f: buildRequest,
            r: handleResponse,
            method: 'processDelivery',
            wsdl: 'InFlightShipmentService_v1.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'ifss',
                Major: 1,
                Intermediate: 0,
                Minor: 0
            }
        },
        validateDelivery: {
            f: buildRequest,
            r: handleResponse,
            method: 'validateDelivery',
            wsdl: 'InFlightShipmentService_v1.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'ifss',
                Major: 1,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* LocationsService */
        searchLocations: {
            f: buildRequest,
            r: handleResponse,
            method: 'searchLocations',
            wsdl: 'LocationsService_v7.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'locs',
                Major: 7,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* PickupService */
        cancelPickup: {
            f: buildRequest,
            r: handleResponse,
            method: 'cancelPickup',
            wsdl: 'PickupService_v15.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'disp',
                Major: 15,
                Intermediate: 0,
                Minor: 0
            }
        },
        createPickup: {
            f: buildRequest,
            r: handleResponse,
            method: 'createPickup',
            wsdl: 'PickupService_v15.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'disp',
                Major: 15,
                Intermediate: 0,
                Minor: 0
            }
        },
        getPickupAvailability: {
            f: buildRequest,
            r: handleResponse,
            method: 'getPickupAvailability',
            wsdl: 'PickupService_v15.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'disp',
                Major: 15,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* RateService */
        getRates: {
            f: buildRequest,
            r: handleResponse,
            method: 'getRates',
            wsdl: 'RateService_v22.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'crs',
                Major: 22,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* ShipService */
        deleteShipment: {
            f: buildRequest,
            r: handleResponse,
            method: 'deleteShipment',
            wsdl: 'ShipService_v21.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'ship',
                Major: 21,
                Intermediate: 0,
                Minor: 0
            }
        },
        deleteTag: {
            f: buildRequest,
            r: handleResponse,
            method: 'deleteTag',
            wsdl: 'ShipService_v21.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'ship',
                Major: 21,
                Intermediate: 0,
                Minor: 0
            }
        },
        processShipment: {
            f: buildRequest,
            r: handleResponse,
            method: 'processShipment',
            wsdl: 'ShipService_v21.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'ship',
                Major: 21,
                Intermediate: 0,
                Minor: 0
            }
        },
        processTag: {
            f: buildRequest,
            r: handleResponse,
            method: 'processTag',
            wsdl: 'ShipService_v21.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'ship',
                Major: 21,
                Intermediate: 0,
                Minor: 0
            }
        },
        validateShipment: {
            f: buildRequest,
            r: handleResponse,
            method: 'validateShipment',
            wsdl: 'ShipService_v21.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'ship',
                Major: 21,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* TrackService */
        getTrackingDocuments: {
            f: buildRequest,
            r: handleResponse,
            method: 'getTrackingDocuments',
            wsdl: 'TrackService_v14.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'trck',
                Major: 14,
                Intermediate: 0,
                Minor: 0
            }
        },
        sendNotifications: {
            f: buildRequest,
            r: handleResponse,
            method: 'sendNotifications',
            wsdl: 'TrackService_v14.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'trck',
                Major: 14,
                Intermediate: 0,
                Minor: 0
            }
        },
        track: {
            f: buildRequest,
            r: handleResponse,
            method: 'track',
            wsdl: 'TrackService_v14.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'trck',
                Major: 14,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* UploadDocumentService */
        uploadDocuments: {
            f: buildRequest,
            r: handleResponse,
            method: 'uploadDocuments',
            wsdl: 'UploadDocumentService_v11.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'cdus',
                Major: 11,
                Intermediate: 0,
                Minor: 0
            }
        },
        uploadImages: {
            f: buildRequest,
            r: handleResponse,
            method: 'uploadImages',
            wsdl: 'UploadDocumentService_v11.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'cdus',
                Major: 11,
                Intermediate: 0,
                Minor: 0
            }
        },

        /* ValidationAvailabilityAndCommitmentService (VACS) */
        serviceAvailability: {
            f: buildRequest,
            r: handleResponse,
            method: 'serviceAvailability',
            wsdl: 'ValidationAvailabilityAndCommitmentService_v8.wsdl',
            path: '/web-services',
            version: {
                ServiceId: 'vacs',
                Major: 8,
                Intermediate: 0,
                Minor: 0
            }
        }
    };

    /* useful enums */
    $this.serviceType = {
        europeFirstInternationalPriority: 'EUROPE_FIRST_INTERNATIONAL_PRIORITY',
        oneDayFreight: 'FEDEX_1_DAY_FREIGHT',
        twoDay: 'FEDEX_2_DAY',
        twoDayAM: 'FEDEX_2_DAY_AM',
        twoDayFreight: 'FEDEX_2_DAY_FREIGHT',
        threeDayFreight: 'FEDEX_3_DAY_FREIGHT',
        cargoAirportToAirport: 'FEDEX_CARGO_AIRPORT_TO_AIRPORT',
        cargoFreightForwarding: 'FEDEX_CARGO_FREIGHT_FORWARDING',
        cargoInternationalExpressFreight: 'FEDEX_CARGO_INTERNATIONAL_EXPRESS_FREIGHT',
        cargoInternationalPremium: 'FEDEX_CARGO_INTERNATIONAL_PREMIUM',
        cargoMail: 'FEDEX_CARGO_MAIL',
        cargoRegisteredMail: 'FEDEX_CARGO_REGISTERED_MAIL',
        cargoSurfaceMail: 'FEDEX_CARGO_SURFACE_MAIL',
        customCriticalAirExpedite: 'FEDEX_CUSTOM_CRITICAL_AIR_EXPEDITE',
        customCriticalAirExpediteExclusiveUse: 'FEDEX_CUSTOM_CRITICAL_AIR_EXPEDITE_EXCLUSIVE_USE',
        customCriticalAirExpediteNetwork: 'FEDEX_CUSTOM_CRITICAL_AIR_EXPEDITE_NETWORK',
        customCriticalCharterAir: 'FEDEX_CUSTOM_CRITICAL_CHARTER_AIR',
        customCriticalPointToPoint: 'FEDEX_CUSTOM_CRITICAL_POINT_TO_POINT',
        customCriticalSurfaceExpedite: 'FEDEX_CUSTOM_CRITICAL_SURFACE_EXPEDITE',
        customCriticalSurfaceExpediteExclusiveUse: 'FEDEX_CUSTOM_CRITICAL_SURFACE_EXPEDITE_EXCLUSIVE_USE',
        customCriticalTempAssureAir: 'FEDEX_CUSTOM_CRITICAL_TEMP_ASSURE_AIR',
        customCriticalTempAssureValidatedAir: 'FEDEX_CUSTOM_CRITICAL_TEMP_ASSURE_VALIDATED_AIR',
        customCriticalWhiteGloveServices: 'FEDEX_CUSTOM_CRITICAL_WHITE_GLOVE_SERVICES',
        distanceDeferred: 'FEDEX_DISTANCE_DEFERRED',
        expressSaver: 'FEDEX_EXPRESS_SAVER',
        firstFreight: 'FEDEX_FIRST_FREIGHT',
        freightEconomy: 'FEDEX_FREIGHT_ECONOMY',
        freightPriority: 'FEDEX_FREIGHT_PRIORITY',
        ground: 'FEDEX_GROUND',
        internationalPriorityPlus: 'FEDEX_INTERNATIONAL_PRIORITY_PLUS',
        nextDatAfternoon: 'FEDEX_NEXT_DAY_AFTERNOON',
        nextDayEarlyMorning: 'FEDEX_NEXT_DAY_EARLY_MORNING',
        nextDayEndOfDay: 'FEDEX_NEXT_DAY_END_OF_DAY',
        nextDayFreight: 'FEDEX_NEXT_DAY_FREIGHT',
        nextDayMidMorning: 'FEDEX_NEXT_DAY_MID_MORNING',
        firstOvernight: 'FIRST_OVERNIGHT',
        groundHomeDelivery: 'GROUND_HOME_DELIVERY',
        internationalDistributionFreight: 'INTERNATIONAL_DISTRIBUTION_FREIGHT',
        internationalEconomy: 'INTERNATIONAL_ECONOMY',
        internationalEconomyDistribution: 'INTERNATIONAL_ECONOMY_DISTRIBUTION',
        internationalEconomyFreight: 'INTERNATIONAL_ECONOMY_FREIGHT',
        internationalFirst: 'INTERNATIONAL_FIRST',
        internationalGround: 'INTERNATIONAL_GROUND',
        internationalPriority: 'INTERNATIONAL_PRIORITY',
        internationalPriorityDistribution: 'INTERNATIONAL_PRIORITY_DISTRIBUTION',
        internationalPriorityExpress: 'INTERNATIONAL_PRIORITY_EXPRESS',
        internationalPriorityFreight: 'INTERNATIONAL_PRIORITY_FREIGHT',
        priorityOvernight: 'PRIORITY_OVERNIGHT',
        sameDay: 'SAME_DAY',
        sameDatCity: 'SAME_DAY_CITY',
        sameDayMetroAfternoon: 'SAME_DAY_METRO_AFTERNOON',
        sameDayMetroMorning: 'SAME_DAY_METRO_MORNING',
        sameDayMetroRush: 'SAME_DAY_METRO_RUSH',
        smartPost: 'SMART_POST',
        standardOvernight: 'STANDARD_OVERNIGHT',
        transborderDistributionConsolidation: 'TRANSBORDER_DISTRIBUTION_CONSOLIDATION'
    };
    $this.paymentType = {
        sender: 'SENDER',
        recipient: 'RECIPIENT',
        thirdParty: 'THIRD_PARTY.'
    };
    $this.packagingType = {
        yourPackaging: 'YOUR_PACKAGING',
        box: 'FEDEX_BOX',
        envelope: 'FEDEX_ENVELOPE',
        pak: 'FEDEX_PAK',
        tube: 'FEDEX_TUBE'
    };
    $this.carrierCodes = {
        express: 'FDXE',
        ground: 'FDXG',
        customCritical: 'FXCC',
        freight: 'FXFR',
        smartPost: 'FXSP'
    };
    $this.dropOffType = {
        serviceCenter: 'BUSINESS_SERVICE_CENTER',
        dropBox: 'DROP_BOX',
        pickup: 'REGULAR_PICKUP',
        courier: 'REQUEST_COURIER',
        station: 'STATION'
    };
    $this.packaging = {
        bag: 'BAG',
        barrel: 'BARREL',
        basket: 'BASKET',
        box: 'BOX',
        bucket: 'BUCKET',
        bundle: 'BUNDLE',
        carton: 'CARTON',
        case: 'CASE',
        container: 'CONTAINER',
        crate: 'CRATE',
        cylinder: 'CYLINDER',
        drum: 'DRUM',
        envelope: 'ENVELOPE',
        hamper: 'HAMPER',
        other: 'OTHER',
        pail: 'PAIL',
        pallet: 'PALLET',
        piece: 'PIECE',
        reel: 'REEL',
        roll: 'ROLL',
        skid: 'SKID',
        tank: 'TANK',
        tube: 'TUBE'
    };
    $this.freightClassType = {
        class50: 'CLASS_050',
        class55: 'CLASS_055',
        class60: 'CLASS_060',
        class65: 'CLASS_065',
        class70: 'CLASS_070',
        class77_5: 'CLASS_077_5',
        class85: 'CLASS_085',
        class92_5: 'CLASS_092_5',
        class100: 'CLASS_100',
        class110: 'CLASS_110',
        class125: 'CLASS_125',
        class150: 'CLASS_150',
        class175: 'CLASS_175',
        class200: 'CLASS_200',
        class250: 'CLASS_250',
        class300: 'CLASS_300',
        class400: 'CLASS_400',
        class500: 'CLASS_500'
    };
    $this.labelStockType = {
        paper4x6: 'PAPER_4X6',
        paper4x8: 'PAPER_4X8',
        paper4x9: 'PAPER_4X9',
        paper7x4_75: 'PAPER_7X4.75',
        paper8_5x11BottomHalfLabel: 'PAPER_8.5X11_BOTTOM_HALF_LABEL',
        paper8_5x11TopHalfLabel: 'PAPER_8.5X11_TOP_HALF_LABEL',
        paperLetter: 'PAPER_LETTER',
        stock4x6: 'STOCK_4X6',
        stock4x6_75LeadingDocTab: 'STOCK_4X6.75_LEADING_DOC_TAB',
        stock4x6_75TrailingDocTab: 'STOCK_4X6.75_TRAILING_DOC_TAB',
        stock4x8: 'STOCK_4X8',
        stock4x9LeadingDocTab: 'STOCK_4X9_LEADING_DOC_TAB',
        stock4x9TrailingDocTab: 'STOCK_4X9_TRAILING_DOC_TAB'
    };
    $this.trackIdentifierType = {
        billOfLading: 'BILL_OF_LADING',
        codReturnTrackingNumber: 'COD_RETURN_TRACKING_NUMBER',
        customerAuthorizationNumber: 'CUSTOMER_AUTHORIZATION_NUMBER',
        customerReference: 'CUSTOMER_REFERENCE',
        department: 'DEPARTMENT',
        documentAirwayBill: 'DOCUMENT_AIRWAY_BILL',
        freeFormReference: 'FREE_FORM_REFERENCE',
        groundInternational: 'GROUND_INTERNATIONAL',
        groundShipmentID: 'GROUND_SHIPMENT_ID',
        groupMPS: 'GROUP_MPS',
        invoice: 'INVOICE',
        jobGlobalTrackingNumber: 'JOB_GLOBAL_TRACKING_NUMBER',
        orderGlobalTrackingNumber: 'ORDER_GLOBAL_TRACKING_NUMBER',
        orderToPayNumber: 'ORDER_TO_PAY_NUMBER',
        outboundLinkToReturn: 'OUTBOUND_LINK_TO_RETURN',
        partnerCarrierNumber: 'PARTNER_CARRIER_NUMBER',
        partNumber: 'PART_NUMBER',
        purchaseOrder: 'PURCHASE_ORDER',
        rerouteTrackingNumber: 'REROUTE_TRACKING_NUMBER',
        returnedToShipperTrackingNumber: 'RETURNED_TO_SHIPPER_TRACKING_NUMBER',
        returnMaterialsAuthorization: 'RETURN_MATERIALS_AUTHORIZATION',
        shipperReference: 'SHIPPER_REFERENCE',
        standardMPS: 'STANDARD_MPS',
        trackingNumberOrDoorTag: 'TRACKING_NUMBER_OR_DOORTA',
        transportationControlNumber: 'TRANSPORTATION_CONTROL_NUMBER'
    };
    $this.imageType = {
        png: 'PNG',
        pdf: 'PDF'
    };

    $this.config = function (args) {
        $this.options = Object.assign(defaults, args);
        return $this;
    };
    $this.dimensionalWeight = function (weight, length, width, height) {
        var dimWeight = Math.ceil(length * width * height / ($this.options.imperial ? 139 : 5000));
        console.log(dimWeight);
        if (dimWeight > weight) {
            return dimWeight;
        } else {
            return weight;
        }
    };
    $this.density = function (weight, length, width, height) {
        return (weight / ((length * width * height) / 1728));
    };
    $this.getFreightClassTier18 = function (density) {
        switch (true) {
            /* Under 1 lb */
            case (density < 1): {
                return $this.freightClassType.class500;
            }
            /* 1 - 2 lbs */
            case (density >= 1 && density < 2): {
                return $this.freightClassType.class400;
            }
            /* 2 - 3 lbs */
            case (density >= 2 && density < 3): {
                return $this.freightClassType.class300;
            }
            /* 3 - 4 lbs */
            case (density >= 3 && density < 4): {
                return $this.freightClassType.class250;
            }
            /* 4 - 5 lbs */
            case (density >= 4 && density < 5): {
                return $this.freightClassType.class200;
            }
            /* 5 - 6 lbs */
            case (density >= 5 && density < 6): {
                return $this.freightClassType.class175;
            }
            /* 6 - 7 lbs */
            case (density >= 6 && density < 7): {
                return $this.freightClassType.class150;
            }
            /* 7 - 8 lbs */
            case (density >= 7 && density < 8): {
                return $this.freightClassType.class125;
            }
            /* 8 - 9 lbs */
            case (density >= 8 && density < 9): {
                return $this.freightClassType.class110;
            }
            /* 9 - 10.5 lbs */
            case (density >= 9 && density < 10.5): {
                return $this.freightClassType.class100;
            }
            /* 10.5 - 12 lbs */
            case (density >= 10.5 && density < 12): {
                return $this.freightClassType.class92_5;
            }
            /* 12 - 13.5 lbs */
            case (density >= 12 && density < 13.5): {
                return $this.freightClassType.class85;
            }
            /* 13.5 - 15 lbs */
            case (density >= 13.5 && density < 15): {
                return $this.freightClassType.class77_5;
            }
            /* 15 - 22.5 lbs */
            case (density >= 15 && density < 22.5): {
                return $this.freightClassType.class70;
            }
            /* 22.5 - 30 lbs */
            case (density >= 22.5 && density < 30): {
                return $this.freightClassType.class65;
            }
            /* 30 - 35 lbs */
            case (density >= 30 && density < 35): {
                return $this.freightClassType.class60;
            }
            /* 35 - 50 lbs */
            case (density >= 35 && density < 50): {
                return $this.freightClassType.class55;
            }
            /* Over 50 lbs */
            case (density >= 50): {
                return $this.freightClassType.class50;
            }
        }
    };
    $this.getFreightClassTier11 = function (density) {
        switch (true) {
            /* Under 1 lb */
            case (density < 1): {
                return $this.freightClassType.class400;
            }
            /* 1 - 2 lbs */
            case (density >= 1 && density < 2): {
                return $this.freightClassType.class300;
            }
            /* 2 - 4 lbs */
            case (density >= 2 && density < 4): {
                return $this.freightClassType.class250;
            }
            /* 4 - 6 lbs */
            case (density >= 4 && density < 6): {
                return $this.freightClassType.class175;
            }
            /* 6 - 7 lbs */
            case (density >= 6 && density < 8): {
                return $this.freightClassType.class125;
            }
            /* 8 - 10 lbs */
            case (density >= 8 && density < 10): {
                return $this.freightClassType.class100;
            }
            /* 10 - 12 lbs */
            case (density >= 10 && density < 12): {
                return $this.freightClassType.class92_5;
            }
            /* 12 - 15 lbs */
            case (density >= 12 && density < 15): {
                return $this.freightClassType.class85;
            }
            /* 15 - 22.5 lbs */
            case (density >= 15 && density < 22.5): {
                return $this.freightClassType.class70;
            }
            /* 22.5 - 30 lbs */
            case (density >= 22.5 && density < 30): {
                return $this.freightClassType.class65;
            }
            /* Over 30 lbs */
            case (density >= 35): {
                return $this.freightClassType.class60;
            }
        }
    };

    function handleResponseError(err, callback) {
        try {
            return callback(err.root.Envelope.Body.Fault, null);
        } catch (e) {
            if ($this.options.debug) {
                console.log(util.inspect(err, {depth: null}));
            }

            return callback(err, null);
        }
    }

    function generateAuthentication(data, resource) {
        var params = {
            WebAuthenticationDetail: {
                UserCredential: {
                    Key: $this.options.key,
                    Password: $this.options.password
                }
            },
            ClientDetail: {
                AccountNumber: $this.options.account_number,
                MeterNumber: $this.options.meter_number
            }
        };

        if ($this.options.compatible) {
            params.WebAuthenticationDetail.ParentCredential = {
                key: $this.options.parentKey,
                password: $this.options.parentPass
            }
        }

        if (resource && resource.version) {
            params['Version'] = {
                ServiceId: resource.version.ServiceId,
                Major: resource.version.Major,
                Intermediate: resource.version.Intermediate,
                Minor: resource.version.Minor
            };
        }

        return Object.assign(params, data);
    }

    function buildRequest(data, resource, callback) {
        createClient(path.join(__dirname, 'wsdl', resource.wsdl), {endpoint: $this.hosts[$this.options.environment] + resource.path}, function (err, client) {
            if (err) {
                return callback(err, null);
            }

            var params = generateAuthentication(data, resource);

            client[resource.method](params, function (err, result) {
                if ($this.options.debug) {
                    parseString(client.lastRequest, {explicitArray: false}, function (err, debug) {
                        console.log(util.inspect(debug, {depth: null}));
                    });
                }

                if (err) {
                    return handleResponseError(err, callback);
                }

                return callback(err, result);
            });
        });
    }

    function handleResponse(res, callback) {
        return callback(null, res);
    }

    function buildResourceFunction(i, resources) {
        return function (data, options, callback) {
            if (!callback) {
                callback = options;
            }

            resources[i].f(data, resources[i], function (err, res) {
                if (err) {
                    return callback(err, null);
                }

                resources[i].r(res, callback);
            });
        }
    }

    for (var i in resources) {
        $this[i] = buildResourceFunction(i, resources);
    }

    return $this.config(args);
}

module.exports = FedEx;
