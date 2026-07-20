class UtmCli < Formula
  desc "UTM parameter parsing CLI tool"
  homepage "https://tanstackship.com"
  license "MIT"

  on_macos do
    on_intel do
      url "https://github.com/tanstackship/homebrew-tap/releases/download/v0.1.0/utm-cli-darwin-amd64"
      sha256 "REPLACE_WITH_ACTUAL_SHA256"
    end
    on_arm do
      url "https://github.com/tanstackship/homebrew-tap/releases/download/v0.1.0/utm-cli-darwin-arm64"
      sha256 "REPLACE_WITH_ACTUAL_SHA256"
    end
  end

  def install
    bin.install "utm-cli-darwin-#{Hardware::CPU.arch}" => "utm"
  end

  test do
    system "#{bin}/utm --version"
  end
end
