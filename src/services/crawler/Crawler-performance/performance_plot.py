import matplotlib.pyplot as plt


# Crawling experiment data
pages = [10, 20, 50, 100, 200, 383]

crawl_time_ms = [
    12510,
    18370,
    40339,
    78332,
    270747,
    950994
]

average_time_ms = [
    1251,
    919,
    807,
    783,
    1354,
    2483
]


# Convert milliseconds to seconds
crawl_time_seconds = [
    t / 1000 for t in crawl_time_ms
]


# ==========================
# Plot 1: Crawl time scaling
# ==========================

plt.figure(figsize=(8,5))

plt.plot(
    pages,
    crawl_time_seconds,
    marker="o"
)

plt.title("Crawl Time vs Number of Pages")
plt.xlabel("Number of Pages Crawled")
plt.ylabel("Total Crawl Time (seconds)")

plt.grid(True)

plt.savefig(
    "crawl_time_vs_pages.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()



# ==============================
# Plot 2: Average time per page
# ==============================

plt.figure(figsize=(8,5))

plt.plot(
    pages,
    average_time_ms,
    marker="o"
)

plt.title("Average Crawl Time per Page")
plt.xlabel("Number of Pages Crawled")
plt.ylabel("Average Time per Page (ms)")

plt.grid(True)

plt.savefig(
    "average_time_per_page.png",
    dpi=300,
    bbox_inches="tight"
)

plt.show()