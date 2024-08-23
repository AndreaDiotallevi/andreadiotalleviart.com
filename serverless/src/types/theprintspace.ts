type ShippingAddress = {
    FirstName: string
    LastName: string
    Line1: string
    Line2: string
    Town: string
    County: string
    PostCode: string
    CountryId: number
    CountryCode: string
    CountryName: string
    PhoneNumber: string
}

type Product = {
    Id: number
    FileName: string
    DisplayName: string
    Description: string
    StoragePrefix: string
    GUID: string
    HDPI: number
    VDPI: number
    Width: number
    Height: number
    DateTaken: string
    UserFirstName: string
    UserLastName: string
    UserDefaultArtistName: string
    ArtistName: string
    Paper: string
    PrintType: string
    HasFramedOptions: boolean
    PrintOptions: PrintOption[]
    DescriptionHTML: string
    DateTakenString: string
    ThumbnailUrl: string
}

type PrintOption = {
    Id: number
    Price: number
    CostPerItem: number
    ShortSideInches: number
    LongSideInches: number
    ShortSideMM: number
    LongSideMM: number
    BorderTopMM: number
    BorderLeftMM: number
    BorderRightMM: number
    BorderBottomMM: number
    WMBorderTopMM: number
    WMBorderLeftMM: number
    WMBorderRightMM: number
    WMBorderBottomMM: number
    WMColour: string
    IsAvailable: boolean
    SellAsEdition: boolean
    EditionsLimit: number
    LastUpdated: string
    HasFrame: boolean
    HasMounting: boolean
    HasCanvas: boolean
    FrameTypeDescription: string
    SubstrateDescription: string
    FrameDescription: string
    FrameWidthMM: number
    WidthMM: number
    HeightMM: number
    EditionsSold: number
    CurrencyCode: string
    PreviewFileNameStandard: string
    PreviewFileNameCloseUp: string
    VerticalBorderMM: number
    HorizontalBorderMM: number
    LongBorderMM: number
    ShortBorderMM: number
    VerticalWMBorderMM: number
    HorizontalWMBorderMM: number
    LongMountMM: number
    ShortMountMM: number
    TotalWidthMM: number
    TotalHeightMM: number
    TotalLongSideMM: number
    TotalShortSideMM: number
    TotalLongSideInches: number
    TotalShortSideInches: number
    AdditionalPricing: number
    CustomFinishingDetails: string
    ExternalSku: string
    DoNotPrint: boolean
    Description: string
    ShortDescription: string
    FullDescription: string
    VariantDescription: string
    Dimensions: {
        Item1: number
        Item2: number
        Item3: number
        Item4: number
    }
}

type OrderItem = {
    Id: number
    ProductId: number
    PrintOptionId: number
    Quantity: number
    ExternalReference: string
    ExternalSku: string
    Product: Product
    PrintOption: PrintOption
}

type DeliveryOption = {
    Id: number
    BranchId: number
    BranchName: string
    Method: string
    DeliveryTime: string
    DeliveryChargeExcludingSalesTax: number
    DeliveryChargeSalesTax: number
    EstimatedDeliveryDateFrom: string
    EstimatedDeliveryDateTo: string
}

export type CreateEmbryonicOrderResponse = {
    Id: number
    ExternalReference: string
    FirstName: string
    LastName: string
    Email: string
    MessageToLab: string
    ShippingAddress: ShippingAddress
    OrderItems: OrderItem[]
    OrderState: string
    DateCreated: string
    DateLastEdited: string
    PrintCostExcludingSalesTax: number
    PrintCostSalesTax: number
    TotalExcludingSalesTax: number
    TotalSalesTax: number
    IsPaid: boolean
    DateCreatedString: string
    DateLastEditedString: string
    DeliveryOptions: DeliveryOption[]
}

export type CreateConfirmedOrderResponse = {
    Id: number
    ExternalReference: string
    FirstName: string
    LastName: string
    Email: string
    MessageToLab: string
    ShippingAddress: ShippingAddress
    OrderItems: OrderItem[]
    OrderState: string
    DateCreated: string
}
