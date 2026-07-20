# tanstack-utm-parse (Java)

> UTM parameter parsing for Java/JVM.

[![Maven](https://img.shields.io/badge/Maven-tanstackship.com-red)](https://tanstackship.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## 🌐 Links

- **Website**: [https://tanstackship.com](https://tanstackship.com)
- **Documentation**: [https://tanstackship.com/docs/java](https://tanstackship.com/docs)
- **Maven Central**: [https://search.maven.org](https://search.maven.org)
- **Issues**: [https://github.com/tanstackship/packages/issues](https://github.com/tanstackship/packages/issues)

## Installation

```xml
<dependency>
    <groupId>com.tanstackship</groupId>
    <artifactId>utm-parse</artifactId>
    <version>1.0.0</version>
</dependency>
```

## Quick Start

```java
import com.tanstackship.utm.UtmParser;

UtmParams params = UtmParser.parse("https://example.com?utm_source=google");
System.out.println(params.getSource()); // google
```

## License

MIT © [Huifer](https://tanstackship.com/about)
