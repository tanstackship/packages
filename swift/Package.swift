// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "UtmParse",
    products: [
        .library(
            name: "UtmParse",
            targets: ["UtmParse"]
        ),
    ],
    targets: [
        .target(
            name: "UtmParse",
            dependencies: []
        ),
        .testTarget(
            name: "UtmParseTests",
            dependencies: ["UtmParse"]
        ),
    ]
)
